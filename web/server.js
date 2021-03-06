var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var postHTML =
  '  <!DOCTYPE html><html><head>  <meta charset="utf-8">  <title>feedback</title></head> <body style="background: #007d65	">   <form method="post" style="    border-radius: 100px;  border: 1px solid #65c294; margin: 100px; background: #65c294; display:flex; flex-flow:column; justify-items: center; align-items: center;">  <div style="opacity: 0.5;margin: 100px 0 200px 0"><input name="email" style="font-size: 3rem;" placeholder="邮箱"></div>  <div style="opacity: 0.5;margin: 0 0 200px 0"><input name="feedback" style="font-size: 3rem;" placeholder="反馈信息"></div>  <input type="submit" style="margin:0 0 100px 0;opacity: 0.5;font-size:2rem; width:200px; height:50px">   </form> </body></html>'

function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf8'
    });
    res.write(postHTML);
    if (body != "") {
      body = querystring.parse(body);
      var time = new Date();
      txt = 'data/' + dateFormat("YYYY_mm_dd_HH_MM_SS", time) + '.json';
      console.log(txt);
      fs.writeFile(txt, JSON.stringify(body), {
        'flag': 'a'
      }, function (err, fd) {
        if (err) {
          console.log("数据 写入失败！");
          return;
        }
        console.log('数据写入成功！');
        console.log("读取写入的数据！");
        fs.readFile(txt, function (err, data) {
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