#!/usr/bin/env node
const https = require('https');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const inquirer = require('inquirer');
const FormData = require('form-data');
const {yearIsValid, courseIsValid} = require('./utils/validators');
const formatTableData = require('./utils/formatTableData');
const Table = require('cli-table3');
const {days, times, toPushToTable} = require('./utils/days-and-times');
const {output} = require('./utils/output');
const questions = require('./utils/questions');
const errorOut = require('./utils/error-out');
const UL_COURSE_TIMETABLE_URL =
  'https://www.timetable.ul.ie/UA/CourseTimetable.aspx';
const table = new Table({
  head: days,
});

// print logo and welcome text
output();

// get the form as HTML
https.get(UL_COURSE_TIMETABLE_URL, (resp) => {
  let formAsHTML = '';
  resp.on('data', (chunk) => {
    formAsHTML += chunk;
  });
  resp.on('end', async () => {
    // create dom from the HTML form page
    const domOfHTMLForm = new JSDOM(formAsHTML);
    const options = domOfHTMLForm.window.document.getElementsByTagName(
        'option',
    );
    const inputs = domOfHTMLForm.window.document.getElementsByTagName('input');
    const state = inputs.item(0).value;
    const generator = inputs.item(1).value;
    const validation = inputs.item(2).value;
    const courses = [];
    // the courses are <option> elements,
    // however the first 7 < option > elements are not courses
    for (let i = 7; i < options.length; i++) {
      courses.push(options[i].textContent);
    }
    const yearInputted = process.argv[2] || undefined;
    const courseInputted = process.argv[3] || undefined;
    let answers = {};
    if (yearInputted != undefined && courseInputted != undefined) {
      if (yearIsValid(yearInputted) && courseIsValid(courseInputted, courses)) {
        answers = {
          year: yearInputted,
          course: courseInputted,
        };
      } else {
        errorOut();
      }
    }
    if (process.argv.length == 2) {
      questions[1]['choices'] = courses;
      await inquirer
          .prompt(questions)
          .then((responses) => {
            answers = responses;
          })
          .catch((error) => {
            console.error(error);
          });
    } else {
      answers = {
        year: yearInputted,
        course: courseInputted,
      };
    }
    const form = new FormData();
    // the form requires a generator, validation token and a state.
    // all of these are sent in the HTML response
    // the form also requires a year and a course prefix
    form.append('__EVENTTARGET', 'ctl00$HeaderContent$CourseDropdown');
    form.append('__VIEWSTATE', state);
    form.append('__VIEWSTATEGENERATOR', generator);
    form.append('__EVENTVALIDATION', validation);
    form.append('ctl00$HeaderContent$CourseYearDropdown', answers['year']);
    const start = answers['course'].length - 6;
    const end = answers['course'].length - 1;
    // if the user inputted the couse as an argument uppercase the argument,
    // otherwise they chose the full couse name from the drop down menu
    // and the last 5 letters of full course are the prefix needed
    const courseCode =
      answers['course'].length <= 5 ?
        answers['course'].toUpperCase() :
        answers['course'].substring(start, end);
    form.append('ctl00$HeaderContent$CourseDropdown', courseCode);
    // submit the form and get a new html response
    form.submit(UL_COURSE_TIMETABLE_URL, (err, res) => {
      let timetabledata = '';
      res.on('data', (d) => {
        timetabledata += d;
      });
      res.on('end', () => {
        // create a new dom when the new respsonse has finished
        const timeTableDom = new JSDOM(timetabledata);
        const tds = timeTableDom.window.document.getElementsByTagName('td');
        // this new dom always has 162 table data elements
        // every second row of 6 elements is empty
        for (let y = 0; y < tds.length; y += 12) {
          for (let j = y; j < y + 6; j++) {
            const index = Math.floor(y / 12);
            toPushToTable[index][times[index]].push(
                formatTableData(tds[j].textContent),
            );
          }
        }
        // create the table from the rows in "toPushToTable"
        for (row of toPushToTable) {
          table.push(row);
        }
        // print the table
        console.log(table.toString());
      });
    });
  });
});
