import _ from "lodash";
import fs from "fs";
import chalk from "chalk";

export async function readFile(filename) {
  process.stdout.write(`Reading from ${chalk.red(filename)}. `);
  const result = fs.readFileSync(filename, { encoding: "utf-8" });
  process.stdout.write(`${result.length} chars, `);
  process.stdout.write(`${result.split("\n").length} lines.\n`);
  return result;
}

export function tokenize(input, matchers) {
  const tokens = [];
  let readHead = 0;

  tokens: while (readHead < input.length) {
    const remain = input.slice(readHead);
    for (const { re, type, value: valueFn } of matchers) {
      const result = remain.match(re);
      if (result == null || result.index != 0) continue;

      const code = result[0];
      tokens.push({ type, code, value: valueFn ? valueFn(code) : code });
      readHead += code.length;
      continue tokens;
    }

    const beforeText = input.slice(0, readHead).split("\n");
    const lineNumber = beforeText.length;
    const charNumber = _.last(beforeText).length;
    const afterText = input.slice(readHead).split("\n");
    const badLine = _.last(beforeText) + _.first(afterText);
    throw new Error(
      [
        `Could not parse line ${lineNumber} char ${charNumber}:`,
        badLine,
        `${_.repeat(" ", charNumber)}^`,
      ].join("\n")
    );
  }

  return tokens;
}

export function parseGrammar(tokens, grammar, expectedType = "program") {
  const remainingTokensM = new WeakMap();

  const ast = parse(tokens, expectedType);

  const remainingTokens = remainingTokensM.get(ast);
  if (remainingTokens.length > 0) {
    const successLength = tokens.length - remainingTokens.length;
    const successTokens = tokens.slice(0, successLength);
    const successCode = successTokens.map(({ code }) => code).join("");
    const successLines = successCode.split("\n");
    const remainCode = remainingTokens.map(({ code }) => code).join("");
    const remainLines = remainCode.split("\n");
    const failLocLine = successLines.length;
    const failLocChar = _.last(successLines).length;
    const nextToken = remainingTokens[0];

    throw new Error(
      [
        `Parsing failed at ln ${failLocLine}, col ${
          failLocChar + 1
        }: unexpected token ${nextToken.type}`,
        `${_.last(successLines)}${_.first(remainLines)}`,
        `${_.repeat(" ", failLocChar)}^`,
      ].join("\n")
    );
  }

  return ast;

  function parse(tokens, expectedType) {
    const expectedClause = grammar[expectedType];
    if (expectedClause == null) return null;

    debugLog(chalk.blue("parse"), {
      expectedType,
      code: debugTokens(tokens),
    });

    option: for (const option of expectedClause.syntax) {
      let remainingTokens = tokens;
      const resultParts = [];

      parts: for (const part of option) {
        debugLog(chalk.blue("clause"), `[${option.join(" ")}]: ${part}`);

        const token = remainingTokens[0];
        if (token != null && token.type == part) {
          debugLog(chalk.green("match"), token);
          resultParts.push(token);
          remainingTokens = remainingTokens.slice(1);
          continue parts;
        }

        const subClause = parse(remainingTokens, part);
        if (subClause != null) {
          debugLog(chalk.green("match"), subClause.type);

          remainingTokens = remainingTokensM.get(subClause);

          if (subClause.type === expectedType) {
            /* append repeats rather than nesting them: */
            resultParts.push(...subClause.parts);
          } else {
            resultParts.push(subClause);
          }

          continue parts;
        }

        debugLog(chalk.red("fail"), `[${option.join(" ")}]: ${part}`);
        continue option;
      }

      const clause = {
        type: expectedType,
        parts: resultParts,
        code: resultParts.map(({ code }) => code).join(""),
      };

      if (expectedClause.value != null)
        clause.value = expectedClause.value(clause);

      remainingTokensM.set(clause, remainingTokens);
      return clause;
    }

    return null;
  }
}

function debugTokens(tokens) {
  return (
    tokens
      .map((t) => `${t.type}(${t.code})`)
      .join(" ")
      .slice(0, 100) + "..."
  );
}

function debugLog(...args) {
  // console.log(...args);
}
