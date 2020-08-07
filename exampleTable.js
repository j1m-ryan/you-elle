const Table = require("cli-table");
const table = new Table({
  head: [
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
});

table.push(
  {
    "9:00": [
      "Mathihlsfd ljksfdjlkfds jpisfdjlfdsjli dsfuhofdsjuoifdsjlifds uhoiufdsukhfdsjulkhs",
      "Value Row 1 Col 2",
    ],
  },
  { "10:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
  { "11:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
  { "12:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
  { "13:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
  { "14:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] },
  { "15:00": ["Value Row 2 Col 1", "Value Row 2 Col 2"] }
);
table.push({ "9:00": "info about a class" });
console.log(table.toString());
