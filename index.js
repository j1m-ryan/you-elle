#!/usr/bin/env node
const Table = require('cli-table3');
const {output} = require('./utils/output');
const shortcut = require('./src/shortcut');
const {days} = require('./utils/days-and-times');
const chooseCourses = require('./src/choose-courses');

const table = new Table({
  head: days,
});

// print logo and welcome text
output();

process.argv.length >= 4 ? shortcut(table) : chooseCourses(table);
