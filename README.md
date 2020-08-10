# you-elle

A nodejs cli for UL course timetables

![](images/program.gif)

## Installation instructions

This package can be installed from the NPM registry or installed after cloning or downloading the repo.

To install from the npm registry run `npm i -g you-elle`  
To install after cloning the repo run `npm i -g .`

## Usage

To use the program run the command `you-elle`  
You can then select your year and course from the menus

Alternatively you can specify year and course as command line arguments in the form `you-elle year course`  
Eg: `you-elle 1 LM121`  
The course must be the UL prefix  
The year must be between 1 and 5

## Built With

- [Node.js](https://nodejs.org/en/) - The runtime

- [Inquirer.js](https://www.npmjs.com/package/inquirer) - For the interactive commands

- [cli-table](https://www.npmjs.com/package/cli-table) - To from a table

- [form-data](https://www.npmjs.com/package/form-data) - To send a request to the UL timetable web app

- [jsdom](https://www.npmjs.com/package/jsdom) - To traverse the dom sent as a response by the web app

- [cfonts](https://www.npmjs.com/package/cfonts) - The fancy you-elle front

- [chalk](https://www.npmjs.com/package/chalk) - To color some of the text

## Acknowledgments

- This timetable cli pulls information [from this web app](https://www.timetable.ul.ie/UA/CourseTimetable.aspx)
