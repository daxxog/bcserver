/* bcserver
 * BarCode Server
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

var express = require('express'),
    BufferStream = require('bufferstream'),
    spawn = require('child_process').spawn,
    fs = require('fs');

var bc = {};

bc.stripper = function(str, valid) {
    if(typeof valid == 'undefined') {
        valid = '1234567890';
    }
    
    var _valid = '';
    
    str.split('').forEach(function(v, i, a) {
        if(valid.indexOf(v) !== -1) {
            _valid += v;
        }
    });
    
    return _valid;
};

bc.zint = function(q) {
    if(typeof q == 'undefined') {
        q = '0';
    }
    
    return spawn('zint', ['--directsvg', '-d', bc.stripper(q.toString()), '-b', '34']);
};

bc.png = function(zint) {
    var png = spawn('convert', ['convert', '-density', '400', '-', 'png:-']),
        bs = new BufferStream(),
        bstwo = new BufferStream();
        
    bs.stringData = '';
        
    bs.on('data', function(data) {
        bs.stringData += data.toString();
    });
        
    bs.on('end', function() {
        var y = function(v) {
            return 'y="' + v + '"';
        };
        
        bstwo.end(bs.stringData.replace(y('59.00'), y('56.00')));
    });
    
    zint.stdout.pipe(bs);
    bstwo.pipe(png.stdin);
    
    return png;
};

var app = express();

var packageDotJson = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')),
    server_info = {
        name: packageDotJson.name,
        description: packageDotJson.description,
        version: packageDotJson.version,
        api: {
            png: '/barcode.png',
            svg: '/barcode.svg'
        }
    };

server_info.port = 80;

if(process.argv[2] === '-p' && (typeof process.argv[3] != 'undefined')) {
    server_info.port = process.argv[3];
}

app.get('/', function(req, res) {
    res.json(server_info);
});

app.get(server_info.api.svg, function(req, res) {
    var zint = bc.zint(req.query.q);
    res.type('svg');
    zint.stdout.pipe(res);
});

app.get(server_info.api.png, function(req, res) {
    var png = bc.png(bc.zint(req.query.q));
    res.type('png');
    png.stdout.pipe(res);
});

app.listen(server_info.port);
console.log(server_info.name, server_info.version, 'started on port', server_info.port);