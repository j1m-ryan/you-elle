const formatTableData = (tableData, y) => {
  if (tableData == undefined || tableData == '' || tableData.trim() == '') {
    return '';
  }

  return tableData
      .trim()
      .substring(13)
      .replace(/(.{20})/g, '$&' + '\n');
};
module.exports = formatTableData;
