bcserver
========

BarCode Server

Dependencies
------------
* nodejs
* zint
* imagemagick

Install deps (ubuntu)
---------------------
```
sudo apt-get install imagemagick cmake libpng-dev

mkdir ~/dev
cd ~/dev
curl -L https://github.com/zint/zint/archive/master.tar.gz | tar zx
cd zint-master
cmake .
make

sudo make install
```

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
upstart
```bash
curl -L https://gist.github.com/daxxog/5341036/raw/bcserver-install.sh | sh
```

Example
--------
```bash
(bcserver -p 8888) &
#wait a few seconds for server to start then do this:
curl http://localhost:8888/12345.svg
```
