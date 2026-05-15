const { exec } = require('child_process');

const server = exec('npx npm run start', (error, stdout, stderr) => {
  console.log(`Server stopped. Error: ${error}, stderr: ${stderr}`);
});

console.log('Server started. Waiting 3 secs...');
setTimeout(() => {
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
      server.kill();
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    server.kill();
  });

  req.write(data);
  req.end();

}, 3000);
