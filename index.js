#!/usr/bin/env node
const https = require("https");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const inquirer = require("inquirer");
const chalk = require("chalk");
const FormData = require("form-data");
const CFonts = require("cfonts");
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
                  "09:00": [],
                },
                { "10:00": [] },
                { "11:00": [] },
                { "12:00": [] },
                { "13:00": [] },
                { "14:00": [] },
                { "15:00": [] },
                { "16:00": [] },
                { "17:00": [] },
                { "18:00": [] },
                { "19:00": [] },
                { "20:00": [] },
                { "21:00": [] },
                { "22:00": [] },
              ];
              const times = [
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
              ];
              for (let y = 0; y < tds.length; y += 6) {
                for (let j = y; j < y + 6; j++) {
                  const index = Math.floor(y / 12);
                  toPushToTable[index][times[index]].push(
                    formatTableData(tds[j].textContent)
                  );
                }
              }

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
CFonts.say("you-elle", {
  font: "block",
  align: "left",
  colors: ["system"],
  background: "transparent",
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: "0",
  gradient: ["red", "#f80"],
  independentGradient: false,
  transitionGradient: false,
  env: "node",
});

console.log(chalk.green("Welcome to you-elle, the UL course timetable cli"));

function formatTableData(tableData) {
  if (tableData == undefined || tableData == "") return "";

  return tableData
    .trim()
    .substring(13)
    .replace(/(.{30})/g, "$&" + "\n");
}
