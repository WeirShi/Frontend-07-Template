const http = require("http");
http.createServer((request, response) => {
  let body = [];
  request.on('error', err => {
    console.error(err);
  }).on('data', chunk => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(
`<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <style>
    div {
      width: 100px;
      height: 100px;
      background: #000000;
    }
    div img {
      width: 50px;
      height: 50px;
    }
  </style>
</head>
<body>
  <div id="my" class="my">
    <img class="img" src="" alt="" />
  </div>
</body>
</html>`
);
  });
}).listen(9000, () => {
  console.log(`this server is running at http://localhost:9000`);
});
