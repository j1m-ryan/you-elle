const validators = require('../utils/validators');
const courses = require('./courses');

describe('year is valid', () => {
  test('for the string 1 to be true', () => {
    expect(validators.yearIsValid('1')).toBe(true);
  });
  test('for the string 6 to be false', () => {
    expect(validators.yearIsValid(0)).toBe(false);
  });
  test('for the number 1 to be true', () => {
    expect(validators.yearIsValid(1)).toBe(true);
  });
  test('for the number 0 to be false', () => {
    expect(validators.yearIsValid(0)).toBe(false);
  });
});

describe('course is valid', () => {
  test('for LM121', () => {
    expect(validators.courseIsValid('LM121', courses)).toBe(true);
  });
  test('for LM9000', () => {
    expect(validators.courseIsValid('LM9000', courses)).toBe(false);
  });
});
