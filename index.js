const fs = require("fs");

async function main() {
  const data = await parseFile("input.txt");

  for (let i = 0; i < data.length; i++) {
    const iVal = data[i];

    for (let j = i; j < data.length; j++) {
      const jVal = data[j];
      const runningSum = iVal + jVal;
      if (runningSum > 2020) continue;

      for (let k = j; k < data.length; k++) {
        const kVal = data[k];

        if (runningSum + kVal == 2020) {
          console.log(iVal, jVal, kVal);
          console.log(iVal * jVal * kVal);
        }
      }
    }
  }
}

async function parseFile(filename) {
  process.stdout.write(`Reading from ${filename}. `);
  const result = fs.readFileSync(filename, { encoding: "utf-8" });
  process.stdout.write(`${result.length} chars, `);
  const lines = result.split("\n");
  process.stdout.write(`${lines.length} lines\n`);
  return lines.map((v) => parseInt(v));
}

const startTime = Date.now();
console.log("----");
main()
  .catch((error) => console.log(error.stack))
  .finally(() => console.log(`Done in ${Date.now() - startTime}ms`));
