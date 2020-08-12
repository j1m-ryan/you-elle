const getCoursePrefix = (course) =>{
  const start = course.length - 6;
  const end = course.length - 1;
  return course.substring(start, end);
};
module.exports = getCoursePrefix;
