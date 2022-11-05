const readline = require('readline');
const fs = require('fs');
const path = require('path');
const process = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\x1b[36m%s\x1b[0m','--Write something (file created on input):');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('\x1b[41m%s\x1b[0m','--Bye--');
    return rl.close();
  }

  input += '\n';
  fs.appendFile(path.resolve(__dirname,'text-file.text'),input.toString(), (err) => {
    if (err) {
      throw new Error;
    }
    console.log('\x1b[32m%s\x1b[0m',`-Received: ${input}`);
    console.log('\x1b[36m%s\x1b[0m','-Write something else:');
  });
});

rl.on('SIGINT', () => {
  console.log('\x1b[41m%s\x1b[0m','--Bye--');
  return rl.close();
});