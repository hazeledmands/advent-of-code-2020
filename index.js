const fs = require('fs');

main().catch((error) => console.log(error.stack));

async function main() {
  const data = await parseFile('input.txt');
  for (let i = 0; i < data.length; i++) {
    for (let j = i; j < data.length; j++) {
      for (let k = j; k < data.length; k++) {
        const inputI = data[i];
        const inputJ = data[j];
        const inputK = data[k];
        if (inputI + inputJ + inputK == 2020) {
          console.log(inputI, inputJ, inputK);
          console.log(inputI * inputJ * inputK);
        }
      }
    }
  }
}

async function parseFile(filename) {
  const result = fs.readFileSync(filename, {encoding: 'utf-8'});
  return result.split("\n").map((v) => parseInt(v));
}
