import chalk from "chalk";
import _ from "lodash";
import { parseFile } from "./text-parsing.js";

async function main() {
  const lines = await parseFile("input.txt");

  const slopes = [
    [1, 1],
    [1, 3],
    [1, 5],
    [1, 7],
    [2, 1],
  ];

  const treeCounts = [];
  for (let [rowInc, colInc] of slopes) {
    let row = rowInc;
    let col = colInc;
    let trees = 0;

    while (row < lines.length) {
      if (lines[row][col] == "#") ++trees;
      col = (col + colInc) % lines[row].length;
      row += rowInc;
    }

    treeCounts.push(trees);
  }

  let total = 1;
  log(treeCounts);
  for (let treeCount of treeCounts) total *= treeCount;
  log(total);
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
  .catch((error) => log(error.stack))
  .finally(() => log(`Done in ${Date.now() - startDate.valueOf()}ms`));
