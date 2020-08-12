const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const formatTableData = require('../utils/formatTableData');
const {toPushToTable, times}=require('../utils/days-and-times');
module.exports =(timetabledata, table)=>{
  const timeTableDom = new JSDOM(timetabledata);
  const tds = timeTableDom.window.document.getElementsByTagName('td');
  for (let y = 0; y < tds.length; y += 12) {
    for (let j = y; j < y + 6; j++) {
      const index = Math.floor(y / 12);
      toPushToTable[index][times[index]].push(
          formatTableData(tds[j].textContent),
      );
    }
  }
  for (row of toPushToTable) {
    table.push(row);
  }
  console.log(table.toString());
};
