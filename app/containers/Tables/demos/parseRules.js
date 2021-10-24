// import { OrderedSet } from 'immutable';
import timestamp from 'time-stamp';

// Enhancing Array.prototype w/ .last() method to catch last element in an array
function enhanceArrayPrototype() {
  if (!Array.prototype.last) {
    Array.prototype.last = function () {
      return this[this.length - 1];
    };
  }
}

/** Rules pattern-matching code is needed for external use also. So i detached it from parseRules() and exported */
export const matchRulePattern = (importedText) => {
  enhanceArrayPrototype(); // calling this here since here is the exported scope for matchRulePattern()
  // console.log(importedText);
  // DEBUGGED not matching comments: needed \r\n match inside comments. Not sure if this is windows related issue
  const importsRegex = /(?<comments>(?:\/\/.*?(?:\r\n|\n))*)(?<rule>(?<deactivated>(?:\/\/|)*\s*(?:\/\/|)*\s*|)rule\s*"(?<rulename>(?<ruleid>.*?)\s+(?<ruletitle>.*?))"(?:\r|\n|\r\n)(?:\/\/)*\s*(?:\/\/)*\s*(?<salience>salience.*?(?:\n|\r\n)|).*(?:\r|\n|\r\n)(?:.|\n|\r|\r\n)*?end)/g;
  // console.log(importsRegex.test(text));  TODO : keep this light validation check
  // console.log('>>>> PARSED: ', [...importedText.matchAll(importsRegex)]);
  return [...importedText.matchAll(importsRegex)];
};

/**
 * Parsing through a text content and extracting rules.
 * Matching works with either single or multiple rules contained in the text.
 * @param {string} importedText
 * @returns {Object[]} rules Array
 */
export const parseRules = (targetServer, selectedTag, importedText) => {
  const matchedRulesPatternArray = matchRulePattern(importedText);
  // console.log('???  Matched this: ', matchedRulesPatternArray);

  let rulesArray = [];

  if (matchedRulesPatternArray.length > 0) {
    matchedRulesPatternArray.forEach(match => {
      // const comments = match.groups.comments || '';
      const {
        comments, rule, deactivated, rulename, salience
      } = match.groups;

      // const content = match[0];

      // Uncomment all rule's part. Keep header-comments
      const commentSlashesRegex = /(?<deactivated>(?:\/\/)\s*)/gm;
      const subst = '';
      const uncommmentRule = rule.replace(commentSlashesRegex, subst);

      const content = comments + uncommmentRule;
      // console.log('>>> Stripped content: ', content);


      rulesArray.push({
        // _id: ruleheader, // Mongo will generate id
        // project: selectedProject // TODO: adding project property to each rule (should get pulled from current-project Redux store)
        name: rulename,
        active: !deactivated,
        locked: false,
        tags: selectedTag,
        versions: [
          {
            version: 1,
            subOn: timestamp.utc('YYYY-MM-DD HH:mm'),
            subBy: 'sotirios@alpha', // TODO: make dynamic
            servers: targetServer,
            edited: false,
            salience: parseInt(salience.trim().split(' ').last()) || 0,
            content
          }]
      });
    });
  }
  console.log(rulesArray);
  return rulesArray;
};
