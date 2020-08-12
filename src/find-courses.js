module.exports = (options) => {
  const courses = [];
  for (let i = 7; i < options.length; i++) {
    courses.push(options[i].textContent);
  }
  return courses;
};
