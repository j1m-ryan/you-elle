const https = require('https');
const errorOut = require('../utils/error-out');
const {yearIsValid, courseIsValid} = require('../utils/validators');
const UL_COURSE_TIMETABLE_URL = require('../utils/link');
const printTimeTable = require('./printTimeTable');
const createForm = require('./createForm');
const getDom = require('./getDom');
const findCourses= require('./find-courses');
const shortcut = (table) =>
  https.get(UL_COURSE_TIMETABLE_URL, (resp) => {
    const yearInputted = process.argv[2];
    const courseInputted = process.argv[3];
    let formAsHTML = '';
    resp.on('data', (chunk) => {
      formAsHTML += chunk;
    });
    resp.on('end', async () => {
      const {options, state, generator, validation} = getDom(formAsHTML);
      const courses = findCourses(options);
      const answers =
        yearIsValid(yearInputted) && courseIsValid(courseInputted, courses) ?
          {
            year: yearInputted,
            course: courseInputted,
          } :
          errorOut();
      const form = createForm(state, generator, validation, answers);
      form.submit(UL_COURSE_TIMETABLE_URL, (err, res) => {
        let timetabledata = '';
        res.on('data', (d) => {
          timetabledata += d;
        });
        res.on('end', () => {
          printTimeTable(timetabledata, table);
        });
      });
    });
  });

module.exports = shortcut;
