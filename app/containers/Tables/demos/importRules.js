import { importRules } from 'ba-actions/RulesTableActions'; // importing the action itself
/* Importing the intance of global store!
NOTE: do not connect with the creation function in configStore.js:
The connect function is not going to work with anything other than React components.
What you can do is pass your store instance to your class and call store.dispatch,
store.getState, and store.subscribe directly.
https://stackoverflow.com/questions/40847699/is-it-possible-to-connect-non-component-class-to-redux-store
*/
import store from '../../../app';
import { parseRules } from './parseRules';

// Reducer Branch
const branch = 'RulesManagerParentTable';

const readSingleFile = (file) => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    // Define reading callbacks
    reader.onabort = () => reject(reader);
    reader.onerror = () => reject(reader);
    reader.onload = () => resolve(reader.result);
    // Perform the actual reading
    reader.readAsText(file)
  })
);


/** Reads, parses and uploads multiple rules from the imported files
 * @param {Blob[]} selectedFiles
 */
export function ImportRules(targetServer, selectedTag, selectedFiles) {
  // PLAN B: 
  // const formData = new FormData();
  // formData.append(file.name, file);

  const promisedFilesList = selectedFiles.map(file => readSingleFile(file));
  Promise.all(promisedFilesList).then(filesContentArray => {
    const allRulesText = filesContentArray.join("\n");
    const allRulesArray = parseRules(targetServer, selectedTag, allRulesText);
    console.log(allRulesArray);// store.dispatch(importRules(allRulesArray, branch)); // Dispatching all rules to state-store , in one go
  })
}

/** Reads, parses and uploads a single created rule */
export function ImportCreatedRule(targetServer, selectedTag, ruleContent) {
  const newRulesArray = parseRules(targetServer, selectedTag, ruleContent);
  store.dispatch(importRules(newRulesArray, branch));
}