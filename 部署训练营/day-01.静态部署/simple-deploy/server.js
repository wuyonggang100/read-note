const http = require("node:http");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  hello, docker. 
</body>
</html>`;

const server = http.createServer((req, res) => res.end(html));
server.listen(3000, () => {
  console.log("Listening 3000");
});
