bcserver
========

BarCode Server

Dependencies
------------
* nodejs
* zint
* imagemagick

Install (try sudo)
-------
stable
```bash
npm install -g bcserver
```
edge
```bash
npm install -g https://github.com/daxxog/bcserver/tarball/master
```

Example
--------
```bash
(bcserver -p 8888) &
#wait a few seconds for server to start then do this:
curl http://localhost:8888/barcode.svg?q=12345
```