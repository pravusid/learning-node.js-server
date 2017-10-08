import express from 'express';
import p1 from './routes/p1';
import p2 from './routes/p2';

const app = express();
// router 사용
app.use('/p1', p1);
app.use('/p2', p2);

app.listen(8080, () => {
  console.log('http://localhost:8080');
});
