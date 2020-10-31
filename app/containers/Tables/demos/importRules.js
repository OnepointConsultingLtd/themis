/* eslint-disable no-extend-native */
/* eslint-disable func-names */
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

/**
 * Imports multiple rules through imported files
 * @param {Blob[]} selectedFiles
 */
export function ImportRules(targetServer, selectedTag, selectedFiles) {
  console.log('Selected files are to be parsed!');
  selectedFiles.forEach((file) => {
    const reader = new FileReader();

    // Define reading callbacks
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      // Do whatever you want with the file contents
      const DSLRcontent = reader.result;
      const newRulesArray = parseRules(targetServer, selectedTag, DSLRcontent);
      // console.log(newRulesArray);
      // console.log(store);
      store.dispatch(importRules(newRulesArray, branch));
      // console.log(store.getState());
    };
    // Perform the actual reading
    reader.readAsText(file);
  });
}

/** Imports single created rule */
export function ImportCreatedRule(targetServer, selectedTag, ruleContent) {
  const newRulesArray = parseRules(targetServer, selectedTag, ruleContent);
  store.dispatch(importRules(newRulesArray, branch));
}

