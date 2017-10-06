var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/count', (req, resp) => {
  let count = parseInt(req.cookies.count);
  if (!count) {
    count = 0;
  }
  count += 1;
  resp.cookie('count', count);
  resp.send('count: ' + count);
});

app.listen(8080, () => {
  console.log('http://localhost:8080');
});
