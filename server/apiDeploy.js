const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs'); // node local file-system access
const timestamp = require('time-stamp');
// parse simple text
app.use(bodyParser.text({ type: 'text/plain' }));

/**
 * Writes an array to an external file
 * @param {string} text rules text
 * @param {string} filename
 */
function generateDSLRFile(text, filename) {
  try {
    if (text.length > 0) {
      fs.writeFile(`${process.cwd()}/${timestamp.utc('YYYYMMDDHHmm')}_${filename}`, text, (err) => { console.log(err); });
      console.log(text);
      console.log('DSLR file has been generated succesfully');
    } else console.log('No files created');
  } catch (err) {
    console.error(err);
  }
}

/** Receive rules dslr text */
app.post('/api/deploy/dev', (req, res) => {
  console.log(req.body);
  generateDSLRFile(req.body, 'rules.dslr');
  res.status(200).send({ message: 'DSLR file has been deployed succesfully to DEV' });
});

/** Receive rules dslr text */
app.post('/api/deploy/prod', (req, res) => {
  console.log(req.body);
  generateDSLRFile(req.body, 'rules.dslr');
  res.status(200).send({ message: 'DSLR file has been deployed succesfully to PROD' });
});

module.exports = app;
