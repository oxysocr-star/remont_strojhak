const http = require('http');

const data = JSON.stringify({
  sessionId: "test",
  message: "hello",
  pageContext: "home",
  history: [],
  leadData: {}
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
