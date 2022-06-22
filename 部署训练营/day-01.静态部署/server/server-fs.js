const http = require("node:http");
const fs = require("node:fs");

const html = fs.readFileSync("./index.html");

// 响应头会自动带上 Content-Length
// const server = http.createServer((req, res) => res.end(html));

// 实际上，此处使用 Stream 处理为更好的方法，但此时需要额外处理下 Content-Length。因为是示例代码，所以不做强求。
const server = http.createServer((req, res) => {
  // fs.createReadStream("./index.html").pipe(res); // 可以返回结果，但没有响应头 Content-Length
  const rs = fs.createReadStream("./index.html");
  let arr = [];

  rs.on("data", function (chunk) {
    arr.push(chunk); //chunk是buffer类型
    // res.write(chunk); // 边发送边写入
  });

  //Buffer.concat合并小buffer
  // 若不手动关闭即 res.end，那么页面将一直处于加载中，在KOA源码中，多处调用了此方法。
  // 注意，若取消对 data 事件的监听，那么页面也会一直处于加载中，因为流一开始是静止的，只有在注册 data 事件后才会开始活动。

  rs.on("end", function () {
    // res.end(); // 最后需要调用 res.end， 否则响应不会终止，页面将一直处于加载中
    const content = Buffer.concat(arr).toString();
    res.setHeader("Content-Length", content.length);
    res.end(content);
    // rs.pipe(res);
  });

  rs.on("error", function (err) {
    console.log(err);
  });
});

server.listen(3000, () => {
  console.log("Listening 3000");
});
