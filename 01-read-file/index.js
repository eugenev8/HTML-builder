const path = require('path');
const fs = require('fs');

let reader = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

reader.on('data', function (chunk) {
  console.log(chunk);
});