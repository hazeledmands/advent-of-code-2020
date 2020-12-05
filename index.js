import chalk from "chalk";
import _ from "lodash";
import { parseFile } from "./text-parsing.js";

const toBool = (dict) => (str) => {
  const mapped = str
    .split("")
    .map((char) => dict[char])
    .join("");
  return parseInt(mapped, 2);
};

async function main() {
  const ast = await parseFile({
    path: "./input.txt",
    lexemes: [
      { type: "row", re: /(F|B){7}/, value: toBool({ F: 0, B: 1 }) },
      { type: "col", re: /(L|R){3}/, value: toBool({ L: 0, R: 1 }) },
      { type: "separator", re: /\n/ },
    ],
    grammar: {
      ticketList: {
        syntax: [["ticket", "separator", "ticketList"], ["ticket"]],
        value: (l) =>
          _(l.parts).filter({ type: "ticket" }).map("value").value(),
      },
      ticket: {
        syntax: [["row", "col"]],
        value: ({ parts, code }) => {
          const [row, col] = _.map(parts, "value");
          return { code, row, col, seatId: row * 8 + col };
        },
      },
    },
    entry: "ticketList",
  });

  console.log(
    _(ast.value)
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
