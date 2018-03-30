const average = require('./average');

test('average of 2 and 4 equal 3', () => {
  expect(average(2, 4)).toBe(3);
});
