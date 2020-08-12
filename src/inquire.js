const inquirer = require('inquirer');

const inquire = async (questions)=>{
  let answers = [];
  await inquirer
      .prompt(questions)
      .then((responses) => {
        answers= responses;
      })
      .catch((error) => {
        console.error(error);
      });
  return answers;
};
module.exports=inquire;
