const FormData = require('form-data');

const createForm = (state, generator, validation, answers)=>{
  const form = new FormData();
  form.append('__EVENTTARGET', 'ctl00$HeaderContent$CourseDropdown');
  form.append('__VIEWSTATE', state);
  form.append('__VIEWSTATEGENERATOR', generator);
  form.append('__EVENTVALIDATION', validation);
  form.append('ctl00$HeaderContent$CourseYearDropdown', answers['year']);
  const courseCode = answers['course'].toUpperCase();
  form.append('ctl00$HeaderContent$CourseDropdown', courseCode);
  return form;
};
module.exports= createForm;
