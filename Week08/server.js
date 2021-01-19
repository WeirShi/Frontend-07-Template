const http = require("http");
const server = http.createServer((req, res) => {
  console.log('request', req);
  console.log('response', res);
  res.end('Hello World')
});

server.listen(9000, () => {
  console.log(`this server is running at http://localhost:9000`);
})

