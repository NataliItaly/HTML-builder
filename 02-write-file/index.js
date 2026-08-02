const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello! Enter some text (type "exit" to quit):');

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    console.log('Goodbye!');
    rl.close();
    return;
  }

  writeStream.write(`${input}\n`);
});

process.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
});

rl.on('close', () => {
  writeStream.end();
  process.exit(0);
});
