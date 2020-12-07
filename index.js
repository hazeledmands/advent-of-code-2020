import chalk from "chalk";
import _ from "lodash";
import { File, Grammar, Rule, Lexeme } from "@demands/text-parsing";

async function main() {
  const grammar = new Grammar([
    new Lexeme("person", { re: /[a-z]+/, evaluate: (p) => p.read().split("") }),
    new Lexeme("separator", { re: /\n/, ignore: true }),
    new Rule("GroupList", {
      syntax: [["Group", "separator", "separator", "GroupList"], ["Group"]],
    }),
    new Rule("Group", {
      syntax: [["person", "separator", "Group"], ["person"]],
    }),
  ]);

  const file = await File.loadFrom("./input.txt");
  const ast = grammar.parse(file, "GroupList");

  console.log(ast.value());
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
