#!/usr/bin/env node
const https = require("https");
const { program, option } = require("commander");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const inquirer = require("inquirer");
const chalk = require("chalk");
const FormData = require("form-data");
const Table = require("cli-table");
const table = new Table({
  head: [
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
});

https
  .get("https://www.timetable.ul.ie/UA/CourseTimetable.aspx", (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp.on("end", () => {
      const dom = new JSDOM(data);
      const options = dom.window.document.getElementsByTagName("option");
      const inputs = dom.window.document.getElementsByTagName("input");
      const state = inputs.item(0).value;

      const generator = inputs.item(1).value;
      const validation = inputs.item(2).value;
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
        const form = new FormData();
        form.append("__EVENTTARGET", "ctl00$HeaderContent$CourseDropdown");
        form.append("__VIEWSTATE", state);
        form.append("__VIEWSTATEGENERATOR", generator);
        form.append("__EVENTVALIDATION", validation);
        form.append("ctl00$HeaderContent$CourseYearDropdown", answers["year"]);
        const start = answers["course"].length - 6;
        const end = answers["course"].length - 1;
        const courseCode = answers["course"].substring(start, end);
        form.append("ctl00$HeaderContent$CourseDropdown", courseCode);
        form.submit(
          "https://www.timetable.ul.ie/UA/CourseTimetable.aspx",
          (err, res) => {
            let newData = "";
            res.on("data", (d) => {
              newData += d;
            });

            res.on("end", () => {
              const dom2 = new JSDOM(newData);
              const tds = dom2.window.document.getElementsByTagName("td");

              const toPushToTable = [
                {
                  "9:00": [
                    "Mathihlsfd ljksfdjlkfds jpisfdjlfdsjli dsfuhofdsjuoifdsjlifds uhoiufdsukhfdsjulkhs",
                    "Value Row 1 Col 2",
                  ],
                },
                { "10:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
                { "11:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
                { "12:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
                { "13:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
                { "14:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
                { "15:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
                { "16:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
                { "17:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
              ];
              for (row of toPushToTable) {
                table.push(row);
              }
              console.log(table.toString());
            });
          }
        );
      });
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
console.log(chalk.green("Welcome to you-elle, the UL course timetable cli"));
