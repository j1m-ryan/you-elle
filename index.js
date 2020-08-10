#!/usr/bin/env node
const https = require("https");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const inquirer = require("inquirer");
const FormData = require("form-data");
const { yearIsValid, courseIsValid } = require("./utils/validators");
const formatTableData = require("./utils/formatTableData");
const Table = require("cli-table");
const { days, times, toPushToTable } = require("./utils/days-and-times");
const { output } = require("./utils/output");
const questions = require("./utils/questions");
const errorOut = require("./utils/error-out");
const UL_COURSE_TIMETABLE_URL =
  "https://www.timetable.ul.ie/UA/CourseTimetable.aspx";
const table = new Table({
  head: days,
});
output();
https.get(UL_COURSE_TIMETABLE_URL, (resp) => {
  let data = "";
  resp.on("data", (chunk) => {
    data += chunk;
  });
  resp.on("end", async () => {
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
    const yearInputted = process.argv[2] || undefined;
    const courseInputted = process.argv[3] || undefined;
    let answers = {};
    if (yearInputted != undefined && courseInputted != undefined) {
      if (yearIsValid(yearInputted) && courseIsValid(courseInputted, courses)) {
        answers = { year: yearInputted, course: courseInputted };
      } else {
        errorOut();
      }
    }
    if (process.argv.length == 2) {
      questions[1]["choices"] = courses;
      await inquirer
        .prompt(questions)
        .then((responses) => {
          answers = responses;
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      answers = { year: yearInputted, course: courseInputted };
    }
    const form = new FormData();
    form.append("__EVENTTARGET", "ctl00$HeaderContent$CourseDropdown");
    form.append("__VIEWSTATE", state);
    form.append("__VIEWSTATEGENERATOR", generator);
    form.append("__EVENTVALIDATION", validation);
    form.append("ctl00$HeaderContent$CourseYearDropdown", answers["year"]);
    const start = answers["course"].length - 6;
    const end = answers["course"].length - 1;
    const courseCode =
      answers["course"].length <= 5
        ? answers["course"].toUpperCase()
        : answers["course"].substring(start, end);
    form.append("ctl00$HeaderContent$CourseDropdown", courseCode);
    form.submit(UL_COURSE_TIMETABLE_URL, (err, res) => {
      let newData = "";
      res.on("data", (d) => {
        newData += d;
      });
      res.on("end", () => {
        const dom2 = new JSDOM(newData);
        const tds = dom2.window.document.getElementsByTagName("td");
        for (let y = 0; y < tds.length; y += 12) {
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
    });
  });
});
