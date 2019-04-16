const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};
const hostname = '127.0.0.1';
const port = 7000;

const server = http.createServer((req, res) => {
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  // res.end('Hello World\n');
  var uri = url.parse(req.url).pathname;
  // process.cwd()返回项目本地路径, unescape将/变为\, uri为query串(host后)
  var fileName = path.join(process.cwd(), unescape(uri))
  // 访问server首页时, 打印 Loading / C:\xx\xx\12 nodes apps\simple-server\
  console.log('Loading ' + uri + ' ' + fileName);
  // 无query串时, uri默认为根路径/
  // if (uri == '/') {
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'text/plain');
  //   res.end('Hello World\nindex');
  // }
  var stats;

  try {
    stats = fs.lstatSync(fileName)
  } catch (e) {
    // fs.lstatSync报错的话执行如下代码
    res.writeHead(404, {'Content-type': 'text/plain'});
    res.write('404 Not Found');
    res.end();
    return;
  }

  if (stats.isFile()) {
    var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
    res.writeHead(200, {'Content-type': mimeType})    
    // 创建文件读取流
    var fileStream = fs.createReadStream(fileName)
    fileStream.pipe(res)
  } else if(stats.isDirectory()) {
		res.writeHead(302, {
			'Location': 'index.html'
		});
		res.end();
	} else {
    res.writeHead(500, {'Content-type': 'text/plain'})
    res.write('500 Internal Error\n');
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});