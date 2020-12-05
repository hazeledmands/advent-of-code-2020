import chalk from "chalk";
import _ from "lodash";
import { readFile, tokenize, parseGrammar } from "./text-parsing.js";

const matchers = [
  { type: "key", re: /\w{3}:/, value: (str) => str.slice(0, 3) },
  { type: "val", re: /[^\s:]+/ },
  { type: "entrySeparator", re: /\n{2}/ },
  { type: "attributeSeparator", re: / |\n/ },
];
const grammar = {
  entryList: [["entry", "entrySeparator", "entryList"], ["entry"]],
  entry: [["attribute", "attributeSeparator", "entry"], ["attribute"]],
  attribute: [["key", "val"]],
};
const requiredAttributes = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

async function main() {
  const file = await readFile("input.txt");
  const tokens = tokenize(file, matchers);
  const ast = parseGrammar(tokens, grammar, "entryList");

  const entries = ast.parts
    .filter(({ type }) => type === "entry")
    .map((entry) =>
      entry.parts
        .filter(({ type }) => type === "attribute")
        .reduce((memo, attribute) => {
          const [key, value] = attribute.parts;
          memo[key.value] = value.value;
          return memo;
        }, {})
    );

  const validEntries = entries.filter((entry) =>
    requiredAttributes.every((attribute) => entry[attribute] != null)
  );

  console.log(validEntries.length);
}

function log() {
  console.log(...arguments);
}

const startDate = new Date();
log(
  // random so it's easier to see that something changed in the console:
  _.repeat("\n", _.random(1, 4))
);
log(
  chalk.underline(
    [
      startDate.getHours().toString().padStart(2, 0),
      startDate.getMinutes().toString().padStart(2, 0),
      startDate.getSeconds().toString().padStart(2, 0),
    ].join(":") + _.repeat(" ", 50)
  )
);

main()
  .catch((error) => log(`\n\n${error.stack}`))
  .finally(() => log(`Done in ${Date.now() - startDate.valueOf()}ms`));
