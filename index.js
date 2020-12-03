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
  console.log(treeCounts);
  for (let treeCount of treeCounts) total *= treeCount;
  console.log(total);
}

const startTime = Date.now();
console.log(`---- ${new Date()}`);
main()
  .catch((error) => console.log(error.stack))
  .finally(() => console.log(`Done in ${Date.now() - startTime}ms`));
