const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.set('view engine', 'pug');
app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended: false}));

app.get('/topic/new', (req, resp) => {
  resp.render('topic/write');
});

app.get('/topic', (req, resp) => {
  const data = fs.readFileSync('./data/topic.txt');
  resp.render('topic/view', {data: JSON.parse(data)});
});

app.post('/topic', (req, resp) => {
  const data = {
    title: req.body.title,
    content: req.body.content
  };
  fs.writeFile('./data/topic.txt', JSON.stringify(data), (err) => {
    if(err) {
      console.log(err);
      resp.status(500).send('ERROR');
    };
    resp.send('입력완료');
  });
});

app.listen(8080, () => {
  console.log('http://localhost:8080');
});