const https = require('https');
const inquire = require('./inquire');
const createForm = require('./createForm');
const questions = require('../utils/questions');
const getDom = require('./getDom');
const findCourses= require('./find-courses');
const UL_COURSE_TIMETABLE_URL = require('../utils/link');
const getCoursePrefix = require('./get-course-prefix');
const printTimeTable = require('./printTimeTable');
const chooseCourses = (table) =>
  https.get(UL_COURSE_TIMETABLE_URL, (resp) => {
    let formAsHTML = '';
    resp.on('data', (chunk) => {
      formAsHTML += chunk;
    });
    resp.on('end', async () => {
      const {options, state, generator, validation} = getDom(formAsHTML);
      const courses = findCourses(options);
      questions[1]['choices'] = courses;
      const answers = await inquire(questions);
      answers['course'] = getCoursePrefix(answers['course']);
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

module.exports = chooseCourses;
