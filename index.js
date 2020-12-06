import chalk from "chalk";
import _ from "lodash";
import { parseFile } from "./text-parsing.js";

async function main() {
  const ast = await parseFile({
    path: "./input.txt",
    lexemes: [
      { type: "person", re: /\w+/, value: (p) => p.split("") },
      { type: "separator", re: /\n/ },
    ],
    grammar: {
      groupList: {
        syntax: [["group", "separator", "separator", "groupList"], ["group"]],
        value: (l) => _(l.parts).filter({ type: "group" }).map("value").value(),
      },
      group: {
        syntax: [["person", "separator", "group"], ["person"]],
        value: (g) => {
          const parts = _.filter(g.parts, { type: "person" });
          return _(parts)
            .map("value")
            .flatten()
            .countBy()
            .filter((count) => count === parts.length)
            .value().length;
        },
      },
    },
    entry: "groupList",
  });

  console.log(_.sum(ast.value));
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
