import chalk from "chalk";
import _ from "lodash";
import { File, Grammar, Rule, Lexeme } from "@demands/text-parsing";

async function main() {
  const grammar = new Grammar([
    new Lexeme("contain", { re: /contain/, ignore: true }),
    new Lexeme("bags", { re: /bags?/, ignore: true }),

    new Lexeme("quantity", { re: /[0-9]+/, evaluate: (q) => parseInt(q) }),
    new Lexeme("noOtherBags", { re: /no other bags/, ignore: true }),
    new Lexeme("newLine", { re: /\n/, ignore: true }),
    new Lexeme("period", { re: /\./, ignore: true }),
    new Lexeme("comma", { re: /,/, ignore: true }),
    new Lexeme("space", { re: / /, ignore: true }),
    new Lexeme("description", { re: /[a-z]+ [a-z]+/ }),

    new Rule("RuleList", {
      syntax: [["Rule", "newLine", "RuleList"], ["Rule"]],
      evaluate: (l) => {
        const rules = new Map();
        for (const rule of l.parts) {
          const [bag, contents] = rule.value();
          rules.set(bag, contents);
        }
        return rules;
      },
    }),
    new Rule("Rule", {
      syntax: [["Bag", "space", "contain", "space", "BagList", "period"]],
    }),
    new Rule("BagList", {
      syntax: [
        ["BagQuantity", "comma", "space", "BagList"],
        ["BagQuantity"],
        ["noOtherBags"],
      ],
      evaluate: (l) => {
        const contents = new Map();
        for (let q of l.parts) {
          let [quantity, bag] = q.value();
          if (contents.has(bag))
            contents.set(bag, contents.get(bag) + quantity);
          else contents.set(bag, quantity);
        }
        return contents;
      },
    }),
    new Rule("BagQuantity", {
      syntax: [["quantity", "space", "Bag"]],
    }),
    new Rule("Bag", {
      syntax: [["description", "space", "bags"]],
      evaluate: (b) => b.parts[0].read(),
    }),
  ]);

  const file = await File.loadFrom("./input.txt");
  const ast = grammar.parse(file, "RuleList");

  const rules = ast.value();
  console.log(rules);

  function countOf(type) {
    if (!rules.has(type)) throw new Error(`Could not find a rule for ${type}!`);
    const contents = rules.get(type);
    return _.sum(
      Array.from(contents.entries()).map(
        ([subtype, count]) => count + count * countOf(subtype)
      )
    );
  }

  console.log(countOf("shiny gold"));
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
