const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'some string',
  resave: false,
  saveUninitialized: true
}));

app.get('/count', (req, resp) => {
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  resp.send('result: ' + req.session.count);
});

app.listen(8080, () => {
  console.log('http://localhost:8080');
});
