const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const getDom = (formAsHTML) => {
  const dom = new JSDOM(formAsHTML);
  const options = dom.window.document.getElementsByTagName('option');
  const inputs = dom.window.document.getElementsByTagName('input');
  const state = inputs.item(0).value;
  const generator = inputs.item(1).value;
  const validation = inputs.item(2).value;
  return {dom, options, state, generator, validation};
};
module.exports = getDom;
