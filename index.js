import chalk from "chalk";
import _ from "lodash";
import { readFile, tokenize, parseGrammar } from "./text-parsing.js";

const charMap = (dict) => (str) => {
  return parseInt(
    str
      .split("")
      .map((char) => dict[char])
      .join(""),
    2
  );
};

const matchers = [
  {
    type: "rowInstruction",
    re: /(F|B){7}/,
    value: charMap({ F: 0, B: 1 }),
  },
  {
    type: "columnInstruction",
    re: /(L|R){3}/,
    value: charMap({ L: 0, R: 1 }),
  },
  { type: "separator", re: /\n/ },
];
const grammar = {
  ticketList: {
    syntax: [["ticket", "separator", "ticketList"], ["ticket"]],
    value: ({ parts }) =>
      parts.filter((p) => p.type === "ticket").map((p) => p.value),
  },
  ticket: {
    syntax: [["rowInstruction", "columnInstruction"]],
    value: ({ parts, code }) => {
      const [row, col] = _.map(parts, "value");
      return { code, row, col, seatId: row * 8 + col };
    },
  },
};

async function main() {
  const file = await readFile("input.txt");
  const tokens = tokenize(file, matchers);
  const { value: tickets } = parseGrammar(tokens, grammar, "ticketList");
  console.log(
    _(tickets)
      .groupBy((t) => t.row)
      .values()
      .filter((row) => row.length < 8)
      .map((row) => _.sortBy(row, "seatId"))
      .value()
  );
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
