const chalk = require("chalk");

const errorOut = () => {
  console.log(
    chalk.redBright(
      "Enter a valid year between 1 and 5 & a valid course prefix"
    )
  );
  console.log(chalk.greenBright("Example usage: you-elle 1 LM121"));
  process.exit(1);
};

module.exports = errorOut;
