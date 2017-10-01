const fs = require('fs');

// 동기
console.log('1');
const data = fs.readFileSync('./data.txt', {encoding: 'utf8'});
console.log(data);

// 비동기
console.log('2');
fs.readFile('./data.txt', {encoding: 'utf8'}, (err,data) => {
  console.log(data);
});
console.log('3');
