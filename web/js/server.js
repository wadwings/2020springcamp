var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var postHTML = 
'  <!DOCTYPE html><html><head>  <meta charset="utf-8">  <title>feedback</title></head> <body style="background: #007d65	">   <form method="post" style="    border-radius: 100px;  border: 1px solid #65c294; margin: 100px; background: #65c294; display:flex; flex-flow:column; justify-items: center; align-items: center;">  <div style="opacity: 0.5;margin: 100px 0 200px 0"><input name="email" style="font-size: 3rem;" placeholder="邮箱"></div>  <div style="opacity: 0.5;margin: 0 0 200px 0"><input name="feedback" style="font-size: 3rem;" placeholder="反馈信息"></div>  <input type="submit" style="margin:0 0 100px 0;opacity: 0.5;font-size:2rem; width:200px; height:50px">   </form> </body></html>'
 
http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    // 解析参数
    // 设置响应头部信息及编码
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
 
    if(body.name && body.url) { // 输出提交的数据
        res.write("网站名：" + body.name);
        res.write("<br>");
        res.write("网站 URL：" + body.url);

        
    } else {  // 输出表单
        res.write(postHTML);
        fs.writeFile('test.json', String(body), { 'flag': 'a' }, function(err, fd){
          if (err){
            console.log("数据写入失败！");
            return;
          }
          console.log('数据写入成功！');
          console.log("读取写入的数据！");
          fs.readFile('test.json', function (err, data) {
             if (err) {
                return console.error(err);
             }
             console.log("异步读取文件数据: " + data.toString());
          });
        })
    }
    res.end();
  });
}).listen(3000);