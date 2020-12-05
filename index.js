import chalk from "chalk";
import _ from "lodash";
import { readFile, tokenize, parseGrammar } from "./text-parsing.js";

const charMap = (dict, range) => (str) => {
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
    value: charMap({ F: 0, B: 1 }, 128),
  },
  {
    type: "columnInstruction",
    re: /(L|R){3}/,
    value: charMap({ L: 0, R: 1 }, 8),
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
    value: ({ parts }) => {
      const [row, col] = parts.map((p) => _.pick(p, "code", "value"));
      return {
        row,
        col,
        seatId: row.value * 8 + col.value,
      };
    },
  },
};

async function main() {
  const file = await readFile("input.txt");
  const tokens = tokenize(file, matchers);
  const { value: tickets } = parseGrammar(tokens, grammar, "ticketList");
  console.log(tickets);
  console.log(Math.max(...tickets.map((t) => t.seatId)));
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
