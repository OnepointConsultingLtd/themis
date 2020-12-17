const fs = require('fs');

function serveRulesJSON() {
  // const dir = 'app/';
  console.log(process.cwd());
  const content = fs.readFileSync('server/rules.json', 'utf8');
  console.log(content);
  return content.toString();
}

module.exports = serveRulesJSON;
