import fs from "fs";
import chalk from "chalk";

export async function parseFile(filename) {
  process.stdout.write(`Reading from ${chalk.red(filename)}. `);
  const result = fs.readFileSync(filename, { encoding: "utf-8" });
  process.stdout.write(`${result.length} chars, `);
  const lines = result.split("\n");
  process.stdout.write(`${lines.length} lines.\n`);
  return lines;
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
export function parseLine(input) {
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
