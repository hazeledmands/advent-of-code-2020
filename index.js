const fs = require("fs");

async function main() {
  const lines = await parseFile("input.txt");
  const data = lines.map(parseLine);

  let validCount = 0;

  for (const { start, end, char, password } of data) {
    let count = 0;
    if (password[start] == char) count++;
    if (password[end] == char) count++;
    if (count === 1) validCount++;
  }

  console.log(validCount);
}

const pattern = [
  { re: /\d+/, parse: (s) => parseInt(s) - 1, name: "start" },
  { re: /-/ },
  { re: /\d+/, parse: (s) => parseInt(s) - 1, name: "end" },
  { re: /\s/ },
  { re: /\w/, name: "char" },
  { re: /: / },
  { re: /.*/, name: "password" },
];
function parseLine(input) {
  const ret = { input };
  let remainder = input;

  for (const step of pattern) {
    const match = remainder.match(step.re);
    if (match == null || match.index !== 0)
      throw new Error(`input ${input} did not match expectations!`);
    remainder = remainder.slice(match[0].length);
    let val = match[0];
    if (step.parse) val = step.parse(val);
    if (step.name) ret[step.name] = val;
  }

  return ret;
}

async function parseFile(filename) {
  process.stdout.write(`Reading from ${filename}. `);
  const result = fs.readFileSync(filename, { encoding: "utf-8" });
  process.stdout.write(`${result.length} chars, `);
  const lines = result.split("\n");
  process.stdout.write(`${lines.length} lines\n`);
  return lines;
}

const startTime = Date.now();
console.log(`---- ${new Date()}`);
main()
  .catch((error) => console.log(error.stack))
  .finally(() => console.log(`Done in ${Date.now() - startTime}ms`));
