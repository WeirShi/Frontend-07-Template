const images = require('images');
const net = require("net");
const parser = require('./parser');
const render = require('./render');

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host || "127.0.0.1";
    this.port = options.port || "8080";
    this.path = options.path || "/";
    this.headers = options.headers || {};
    this.body = options.body || {};

    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&");
    } else if (headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    }

    this.headers["Content-Length"] = this.bodyText.length;
  }

  // construct request content
  // each line can not has space in the front of line!!!
  toString () {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\r\n")}\r
\r
${this.bodyText}
`;
  }

  send (connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        // if has connection, then use it to send request content.
        connection.write(this.toString());
      } else {
        // if has not connection, then create one to send request content.
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        });
      }

      connection.on("data", data => {
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      });

      connection.on("error", err => {
        reject(err);
        connection.end();
      });

      connection.on('end', () => {
      });
    });
  }
}

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;

    this.statusLine = "";

    this.headers = {};
    this.headerName = "";
    this.headerValue = "";

    this.bodyParser = null;
  }

  get isFinished () {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response () {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join("")
    }
  }

  receive (string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveCharactor(string.charAt(i));
    }
  }

  receiveCharactor (charactor) {
    if (this.current === this.WAITING_STATUS_LINE) {
      // construct statusLine
      if (charactor === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += charactor;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      // check the end of statusLine
      if (charactor === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      // separate name and value of a header with ':'
      // check the whole headers content end with '\r'
      if (charactor === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (charactor === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END;
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new ThunkedBodyParser();
        }
      } else {
        // collect a headers name
        this.headerName += charactor;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      // check the begin of header value
      if (charactor === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      // 
      if (charactor === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        // save a headers line with headerName and headerValue
        this.headers[this.headerName] = this.headerValue;
        // initial them to collect next headers line
        this.headerName = "";
        this.headerValue = "";
      } else {
        // collect a headers value
        this.headerValue += charactor;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      // check the end of a headers line
      if (charactor === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      // check the end of headers content
      if (charactor === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveCharactor(charactor);
    }
  }
}

class ThunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }

  receiveCharactor (charactor) {
    if (this.current === this.WAITING_LENGTH) {
      if (charactor === '\r') {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        // the first line in chunk body is a number in hexadecimal
        // this line called length line
        this.length *= 16;
        this.length += parseInt(charactor, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      // check the end of length line
      if (charactor === '\n') {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      // collect each line of chunk in content
      this.content.push(charactor);
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      if (charactor === '\r') {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (charactor === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}

async function sendRequest() {
  let request = new Request({
    method: "POST",     // HTTP
    host: "127.0.0.1",  // IP
    port: "9000",       // TCP
    path: "/",          // HTTP
    headers: {          // HTTP, use key-value pair
      ["X-Foo2"]: "customed"
    },
    body: {             // HTTP
      name: "Tom & Jerry"
    }
  });

  let response = await request.send();
  

  let dom = parser.parseHTML(response.body);
  console.log(dom);

  let viewport = images(800, 600);

  // 单个元素
  // render(viewport, dom.children[0].children[3].children[1].children[3]);

  // dom树
  render(viewport, dom);

  viewport.save("viewport.jpg");
}

sendRequest();