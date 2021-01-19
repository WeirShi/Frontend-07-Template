const net = require('net');

class Request {
  constructor(options) {
    this.path = options.path || '/';
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || '80';
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`)
                                            .join('&')
    }

    this.headers['Content-length'] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      let parser = new RequestParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        });
      }

      connection.on('data', data => {
                  parser.receiveString(data.toString());
                  if (parser.isFinished) {
                    resolve(parser.response);
                    connection.end();
                  }
                })
                .on('error', error => {
                  reject(error);
                  connection.end();
                })
    });
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}`;
  }
}


class RequestParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.HEADER_NAME = 2;
    this.HEADER_SPACE = 3;
    this.HEADER_VALUE = 4;
    this.HEADER_END = 5;
    this.HEADER_BLOCK_END = 6;
    this.BODY_START = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }

  receiveString(string) {
    for (let char of string) {
      this.receiveChar(char);
    }
  }

  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.HEADER_NAME;
      }
    } else if (this.current === this.HEADER_NAME) {
      if (char === '\r') {
        this.current = this.HEADER_BLOCK_END;
      } else if (char === ':') {
        this.current = this.HEADER_SPACE;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.HEADER_VALUE;
      }
    } else if (this.current === this.HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.HEADER_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerValue = '';
        this.headerName = '';
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.HEADER_END) {
      if (char === '\n') {
        this.current = this.HEADER_NAME;
      }
    } else if (this.current === this.HEADER_BLOCK_END) {
      if (this.headers['Transfer-Encoding'] === 'chunked') {
        this.bodyParser = new TrunkBodyParser();
      }
      if (char === '\n') {
        this.current = this.BODY_START;
      }
    } else if (this.current === this.BODY_START) {
      this.bodyParser.receiveChar(char);
    }
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(' ')
    }
  }
}

class TrunkBodyParser {
  constructor() {
    this,current = 0;
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_FINISH = 1;
    this.WAITING_READING = 2;
    this.WAITING_READING_NEW_LINE = 3;
    this.WAITING_READING_LINE_FINISH = 4;

    this.isFinished = false;
    this.length = 0;
    this,content = [];
  }

  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_FINISH;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_FINISH) {
      if (char === '\n') {
        this.current = this.WAITING_READING;
      }
    } else if (this.current === this.WAITING_READING) {
      if (this.isFinished) {
        return;
      }
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_READING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_READING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_READING_LINE_FINISH;
      }
    } else if (this.current === this.WAITING_READING_LINE_FINISH) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}

async function sendRequest() {
  let req = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8888,
    path: '/',
    headers: {
      ['X-foo-2']: 'customed'
    },
    body: {
      name: 'Tom & Jerry'
    }
  });

  let res = await req.send();
  console.log('response', res);
}

sendRequest();
