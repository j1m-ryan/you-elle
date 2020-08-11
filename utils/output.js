const CFonts = require('cfonts');
const chalk = require('chalk');

const fontOptions = {
  font: 'block',
  align: 'left',
  colors: ['system'],
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: '0',
  gradient: ['red', '#f80'],
  independentGradient: false,
  transitionGradient: false,
  env: 'node',
};
const output = () => {
  CFonts.say('you-elle', fontOptions);
  console.log(chalk.green('Welcome to you-elle, the UL course timetable cli'));
};

module.exports = {output};
