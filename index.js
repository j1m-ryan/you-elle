#!/usr/bin/env node

console.log("Welcome to you-elle, the UL timetable cli");
if (process.argv.length < 4) {
  console.log("Please specify a year and a course");
  console.log("Example usage: $ you-elle 1 LM121");
} else if (process.argv.length == 4) {
  const year = process.argv[2];
  const course = process.argv[3];
  if (!isInteger(year) || year > 4 || year < 1) {
    console.log("Enter a valid year between 1 and 4");
    process.exit(1);
  } else if (course.length < 5) {
    console.log("Enter a valid course");
    process.exit(1);
  }
  console.log(`Your year is ${year} and your course is ${course}`);
} else {
  console.log("Too many arguments");
}

function isInteger(value) {
  return /^\d+$/.test(value);
}
