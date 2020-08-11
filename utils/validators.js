const isInteger = (str) => {
  const pattern = /^\d+$/;
  return pattern.test(str);
};
const yearIsValid = (year) => {
  if (!isInteger(year)) return false;
  return parseInt(year) >= 1 && parseInt(year) <= 5;
};
const courseIsValid = (course, courses) => {
  for (let i = 7; i < courses.length; i++) {
    const c = courses[i];
    const start = c.length - 6;
    const end = c.length - 1;
    if (c.substring(start, end).toLowerCase() === course.toLowerCase()) {
      return true;
    }
  }
  return false;
};

module.exports = {yearIsValid, courseIsValid};
