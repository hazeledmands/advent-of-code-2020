const fs = require("fs");

main().catch((error) => console.log(error.stack));

async function main() {
  console.log("----");
  const data = await parseFile("input.txt");

  for (let i = 0; i < data.length; i++) {
    const iVal = data[i];

    for (let j = i; j < data.length; j++) {
      const jVal = data[j];
      const runningSum = iVal + jVal;

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
  const result = fs.readFileSync(filename, { encoding: "utf-8" });
  return result.split("\n").map((v) => parseInt(v));
}
