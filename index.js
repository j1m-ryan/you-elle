#!/usr/bin/env node
const https = require("https");
const { program, option } = require("commander");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const inquirer = require("inquirer");
const chalk = require("chalk");

https
  .get("https://www.timetable.ul.ie/UA/CourseTimetable.aspx", (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp.on("end", () => {
      const dom = new JSDOM(data);
      const options = dom.window.document.getElementsByTagName("option");
      const courses = [];
      for (let i = 7; i < options.length; i++) {
        courses.push(options[i].textContent);
      }
      const questions = [
        {
          type: "list",
          name: "year",
          message: "Which year are you in?",
          choices: [1, 2, 3, 4, 5],
        },
        {
          type: "list",
          name: "course",
          message: "Which course are you in?",
          choices: courses,
        },
      ];
      inquirer.prompt(questions).then((answers) => {
        console.log(answers);
      });

      /* for (let i = 7; i < options.length; i++) {
        console.log(options[i].textContent);
      } */
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
console.log(chalk.green("Welcome to you-elle, the UL timetable cli"));

/* if (process.argv.length < 4) {
  console.log("Please specify a year and a course");
  console.log("Example usage: $ you-elle 1 LM121");
} else if (process.argv.length == 4) {
  const year = process.argv[2];
  const course = process.argv[3];
  if (!isInteger(year) || year > 4 || year < 1) {
    console.log("Enter a valid year between 1 and 4");
    process.exit(1);
  } else if (course.length >= 5) {
    console.log("Enter a valid course");
    process.exit(1);
  }
  console.log(`Your year is ${year} and your course is ${course}`);
} else {
  console.log("Too many arguments");
}

function isInteger(value) {
  return /^\d+$/.test(value);
}
 */
