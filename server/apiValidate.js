const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { exec } = require('child_process');

// parse simple text
app.use(bodyParser.text({ type: 'text/plain' }));

/**
 * Writes an array to an external file
 * @param {string} text rules text
 * @param {string} filename
 */
function validateRules(text, response) {
  console.log(__dirname, process.cwd());
  exec(`java -jar ./server/validator/validate-dslr-string-0.1-jar-with-dependencies.jar ${text} ./server/validator/ALanguage.dsl`,
    (err, stdout, stderr) => {
      console.log('err: ', err);
      console.log('stderr: ', stderr);
      console.log('stdout: ', stdout);
      response({ err, stderr, stdout });
    });
}

// function parseErrors(stdout) {
// Parse the errors
// const errorsRegexPattern = /(?:\[[0-9]+,[0-9]+\]: \[ERR [0-9]*\] Line [0-9]+:[0-9]+\s.*?)(?=,\s\[[0-9]+,[0-9]+\]|\]$)+/g;
// console.log(stdout, stdout.match(errorsRegexPattern));
// return stdout.match(errorsRegexPattern);
// }

/** Receive rules dslr text */
app.post('/api/validate/rule', (req, res) => {
  console.log('This is the requested rule: ', req.body);
  validateRules(req.body,
    ({ err, stderr, stdout }) => {
      if (err || stderr) res.status(404).send({ message: `${err} ${stderr}` });
      else res.status(200).send({ errors: stdout /* parseErrors(stdout) */, serverFolder: `${__dirname} & ${process.cwd()}` });
    });
});

module.exports = app;
