const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// static file serving을 위해서 built-in middleware 사용
// public directory의 파일을 서버로 접근 가능해짐
app.use(express.static('public'));
// 템플릿 엔진 설정
app.set('view engine', 'pug');
// prettify html
app.locals.pretty = true;

// body-parser 사용
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, resp) => {
  resp.send('Helloworld');
});

// 템플릿엔진 사용하지 않고 전체 출력
app.get('/dynamic', (req, resp) => {
  let list = '';
  for(let i=0; i<5; i++) {
    list += '<h2>안녕하세요</h2>';
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dynamic Page</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        ${list}
      </body>
    </html>
  `;
  resp.send(html);
});

// pug 템플릿 엔진을 사용하여 출력
app.get('/template', (req, resp) => {
  const time = Date();
  resp.render('template', {time: time, title: 'pug practice'});
});

// parameter를 받아보자
app.get('/list', (req, resp) => {
  const topic = {
    id: req.query.id,
    name: req.query.name
  };
  resp.send(topic);
});

app.get('/list/:id', (req, resp) => {
  const topic = {
    id: req.params.id
  };
  resp.send(topic);
});

app.get('/login', (req, resp) => {
  resp.render('login');
});

// post로 데이터를 받아보자
app.post('/login', (req, resp) => {
  resp.send(req.body.id + ' ' + req.body.passwd);
});

// 서버 가동
app.listen(8080, () => {
  console.log('http://localhost:8080');
});
