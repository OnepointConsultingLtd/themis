/* eslint-disable arrow-body-style */
/* eslint-disable no-shadow */
import { /* Map, */ fromJS, OrderedSet, List } from 'immutable';
import timestamp from 'time-stamp';
import axios from 'axios';
import * as types from './actionTypes';
import { matchRulePattern } from '../containers/Tables/demos/parseRules';


/** Async inject data from /api/rules => v1.5 */
export const fetchAction = (branch) => async (dispatch) => {
  const response = await axios.get('/api/rules/load'); // using axios to allow multiple body consumes!!
  if (response.status !== 200) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: 'Could not load rules from server',
      severity: 'error'
    });
  } else {
    dispatch({
      branch,
      type: `${branch}/${types.FETCH_DATA}`,
      items: response.data
    });
  }
};

/** Async import new rules into database */
export const importRules = (items, branch) => (dispatch) => {
  // console.log('>>>>> About to POST: ', items);
  fetch('/api/rules/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(items)
  })
    .then(response => response.json())
    .then(({ message, insertedIds, deletedIds }) => { // TODO: Error Handling: inbetween .then() to check message and act accordingly
      // console.log(message, 'Inserting: ', insertedIds, 'Deleting: ', deletedIds);
      return dispatch({
        branch,
        type: `${branch}/IMPORT_RULES`,
        items,
        message,
        insertedIds,
        deletedIds
      });
    });
};

/** Cloning the top version in the versions-list (max version) within a Rule (id). That's the 'item' */
export const cloneAction = (ruleId, item, branch) => async (dispatch) => {
  // console.log('>>>>> About to clone and POST: ', item);
  // const itemNonImmutable = item.toJS();
  // Manipulating the cloned version: upgrading version, attaching timestamps, injecting current user
  const clonedRow = {
    version: item.get('version') + 1,
    salience: item.get('salience'),
    name: item.get('name'),
    subOn: timestamp.utc('YYYY-MM-DD HH:mm'),
    subBy: 'sotirios@alpha', // TODO: Inject Logged in user from login reducer
    servers: ['NA'],
    tags: item.get('tags'), // TODO: Should tags get cloned too ?
    edited: false,
    content: item.get('content')
  };
  const response = await fetch(`/api/version/clone/${ruleId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(clonedRow)
  });

  if (response.status !== 200) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: 'Could not connect to the server',
      severity: 'error'
    });
  } else {
    dispatch({
      ruleId, // _id remains same (_id is of parent not of nested versions)
      item: fromJS(clonedRow), // Transforming item to Map, compatible w/ immutable.js
      branch,
      type: `${branch}/${types.CLONE_MAX_VERSION}`
    });
  }
};

export const removeAction = (ruleId, branch) => async (dispatch) => {
  const response = await fetch(`/api/rules/delete/${ruleId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    // body: JSON.stringify(clonedRow)
  });
  if (response.status !== 200) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: 'Could not connect to the server',
      severity: 'error'
    });
  } else {
    dispatch({
      ruleId,
      branch,
      type: `${branch}/${types.REMOVE_ROW}`,
    });
  }
};

/** Update version's servers or tags */
export const updateAction = (ruleId, event, item, branch) => ({
  ruleId,
  branch,
  type: `${branch}/${types.UPDATE_ROW}`,
  event,
  item
});
/** DECOMMISSIONED: due to change of server-selection logic */
// export const updateAction = (ruleId, event, item, branch) => // updating (content, servers & tags) will NOT get stored in Mongo
//   (dispatch, getState) => {
//     const injectedServersConfig = getState().get('ServersConfig').get('dataTable'); // servers and tags config injected inside rules redux
//     dispatch({
//       ruleId,
//       branch,
//       type: `${branch}/${types.UPDATE_ROW}`,
//       event,
//       item,
//       injectedServersConfig
//     });
//   };

export const updateRuleStatus = (ruleId, oldValue, branch) => async (dispatch) => {
  // console.log('>>>>> About to update status and POST: ', oldValue);

  const response = await fetch(`/api/version/update/status/${ruleId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ active: !oldValue }) // toggle value and POST
  });

  if (response.status !== 200) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: 'Could not connect to the server',
      severity: 'error'
    });
  } else {
    dispatch({
      ruleId, // _id remains same (_id is of parent not of nested versions)
      oldValue,
      branch,
      type: `${branch}/UPDATE_RULE_STATUS`,
    });
  }
};
export const editAction = (ruleId, item, branch) => ({ // click-on-edit will NOT be stored in Mongo
  ruleId,
  branch,
  type: `${branch}/${types.EDIT_ROW}`,
  item
});
export const discardAction = (ruleId, item, branch) => ({ // click-on-discard will NOT be stored in Mongo
  ruleId,
  branch,
  type: `${branch}/DISCARD_ROW`,
  item
});

/** Cloning the top version in the list (max version). That's the 'item' */
export const saveAction = (ruleId, version, selectedServers, selectedTags, content, branch, setValErrorPopUp) => async (dispatch, getState) => {
  // Do the parsing here: we parse name, salience, status and content
  /* eslint-disable-next-line prefer-const */
  let { salience, ruleheader } = matchRulePattern(content)[0].groups;
  // eslint-disable-next-line radix
  salience = parseInt(salience.trim().split(' ').last()) || 0;
  let nonEmptyServers;
  if (!selectedServers.length) nonEmptyServers = ['NA'];
  else nonEmptyServers = selectedServers;
  // Manipulating the cloned version: upgrading version, attaching timestamps, injecting current user
  const savedVersion = {
    version,
    name: ruleheader, // newly parsed rule-name
    subOn: timestamp.utc('YYYY-MM-DD HH:mm'),
    subBy: 'sotirios@alpha', // TODO: Inject Logged in user from login reducer
    servers: nonEmptyServers,
    tags: selectedTags,
    edited: false,
    salience, // newly parsed rule-salience
    content
  };

  // console.log('>>>> SAVING: ', savedVersion);

  // TODO:  WRAP THIS W/ AN "IF-SERVERS-HAVE-CHANGED" CONDITION
  // >>>>>>>>>>>>>>>> UPDATE ALL SERVERS IN RULE RECORD <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // Update the rest of the versions' selected servers (remove the current selected servers from other versions)
  // console.log('>>> STATE: ', getState());

  // tap-into global state!
  const stateOfRules = getState().getIn([branch, 'dataTable']);
  // Tap into the specific rule_id
  const rulesListIndex = stateOfRules.findIndex(rule => rule.get('_id') === ruleId);
  // Get this rule
  let rule = stateOfRules.get(rulesListIndex);
  // tap-into all versions array of the found rule
  // const versionsArray =
  // console.log('Selected servers are these: ', selectedServers);
  selectedServers.forEach(selectedServer => {
    const whichVersionIndexHasThisServer = rule.get('versions').findIndex(version => version.get('servers').includes(selectedServer));
    // Let's see if we found anything
    if (whichVersionIndexHasThisServer > -1) {
      // Found server in another version. Let's remove it! "There can be only one" (Highlander)
      const whichServersDoesItHave = rule.get('versions').getIn([whichVersionIndexHasThisServer, 'servers']);
      // Removing them via subrtaction!
      // console.log('Target has: ', whichServersDoesItHave);
      let newServersAfterSubtraction = OrderedSet(whichServersDoesItHave).subtract([selectedServer]); // NOTE!: SUBTRACT always works with arrays
      // console.log(newServersAfterSubtraction.size);
      if (newServersAfterSubtraction.size === 0) newServersAfterSubtraction = List(['NA']);
      // console.log('Target now has: ', newServersAfterSubtraction);
      // Applying changes in rule, immutably!
      rule = rule.setIn(['versions', whichVersionIndexHasThisServer, 'servers'], newServersAfterSubtraction);
    }
  });
  // >>>>>>>>>>>>>>>> UPDATE ALL SERVERS IN RULE RECORD <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // TODO:  WRAP THIS W/ AN "IF-SERVERS-HAVE-CHANGED" CONDITION

  // Updating the editted version record back into the rule's versions key-value
  /** Example, deriving the index from the version number:
   *  ver: 6 5 4 3 2 1
      ind: 0 1 2 3 4 5
      len = 6
      5 is index 0 --> len - ver - 1 = 6 - 6 = 0
      3 is index 2 --> len - 3 - 1 = 6 - 4 = 2
      1 is index 4 --> 6 - 2 = 4
      ver: 1
      ind: 0
      1 is index 0 --> len - 1 = 0
   */
  rule = rule.setIn(['versions', (rule.get('versions').size - version)], fromJS(savedVersion)); // this thing wouldn't update with Map(savedVersion), not sure why
  // console.log('>>> Which index: ', rule.get('versions').size - version);
  // console.log('Rule to send: ', rule.toJS());

  // Posting the whole rule
  const response = await fetch(`/api/version/update/${ruleId}/${version}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(rule.toJS())
  });

  if (!response.ok) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: 'Could not connect to the server',
      severity: 'error'
    });
  } else if (response.status === 201) {
    const { errorArray } = await response.json();
    setValErrorPopUp({ status: true, errorArray }); // launch the validation error popup in RulesManager page
  } else {
    dispatch({
      rule, // Dispatching the whole rule
      branch,
      type: `${branch}/${types.SAVE_ROW}`, // TODO: rename action to UPDATE_RULE
    });
  }
};

// -----------------------------------------------------------------------------> BULK ACTIONS
export const bulkDeactivate = (bulkIds, branch) => async (dispatch) => {
  const response = await axios.post('/api/bulk/rules/deactivate', { array: [...bulkIds] }); // array in body cannot be posted otherwise
  if (response.status !== 200) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: 'Could not connect to the server',
      severity: 'error'
    });
  } else { // SUCCESS
    dispatch({
      bulkIds,
      branch,
      type: `${branch}/BULK_DEACTIVATE`,
      message: response.data.message // message is nested under .data node
    });
  }
};
export const bulkActivate = (bulkIds, branch) => async (dispatch) => {
  const response = await axios.post('/api/bulk/rules/activate', { array: [...bulkIds] }); // array in body cannot be posted otherwise
  if (response.status !== 200) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: 'Could not connect to the server',
      severity: 'error'
    });
  } else { // SUCCESS
    dispatch({
      bulkIds,
      branch,
      type: `${branch}/BULK_ACTIVATE`,
      message: response.data.message // message is nested under .data node
    });
  }
};
export const bulkDelete = (bulkIds, branch) => async (dispatch) => {
  // console.log(bulkIds);
  const response = await axios.post('/api/bulk/rules/delete', { array: [...bulkIds] }); // array in body cannot be posted otherwise
  if (response.status !== 200) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: 'Could not connect to the server',
      severity: 'error'
    });
  } else { // SUCCESS
    dispatch({
      bulkIds,
      branch,
      type: `${branch}/BULK_DELETE`,
      message: response.data.message // message is nested under .data node
    });
  }
};
// <------------------------------------------------------------------- BULK ACTIONS

export const showNotification = (message, severity, branch) => ({ // dispatch notification only
  branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
  type: `${branch}/SHOW_NOTIF`,
  message,
  severity
});

export const closeNotifAction = branch => ({
  branch,
  type: `${branch}/${types.CLOSE_NOTIF}`,
});


// -------------------------------- v0.5 SYNC ACTIONS
// Old sync code => v0.1 & v1
// export const fetchAction = (items, branch) => ({
//   branch,
//   type: `${branch}/${types.FETCH_DATA}`,
//   items
// });
// export const addAction = (ruleId, branch) => ({   // NOT USED / clone row was used instead
//   ruleId,
//   branch,
//   type: `${branch}/${types.ADD_EMPTY_ROW}`
// });
// export const updateAction = (ruleId, event, item, branch) => ({
//   ruleId,
//   branch,
//   type: `${branch}/${types.UPDATE_ROW}`,
//   event,
//   item
// });
// export const updateRuleStatus = (ruleId, oldValue, branch) =>
// ({
//   ruleId,
//   oldValue,
//   branch,
//   type: `${branch}/UPDATE_RULE_STATUS`,
// });
// SAVE version: Sync version
// export const saveAction = (ruleId, item, branch, content) => ({
//   ruleId,
//   branch,
//   type: `${branch}/${types.SAVE_ROW}`, // SAVE TO MONGO
//   item,
//   content
// });
// export const updateExpandedRows = (item, branch) => ({
//   branch,
//   type: `${branch}/UPDATE_EXPANDED`,
//   item
// });

