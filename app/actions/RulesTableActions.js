/* eslint-disable no-shadow */
import { Map } from 'immutable';
import timestamp from 'time-stamp';
import axios from 'axios';
import * as types from './actionTypes';
import { matchRulePattern } from '../containers/Tables/demos/parseRules';

// Old sync code => v0.1 & v1
// export const fetchAction = (items, branch) => ({
//   branch,
//   type: `${branch}/${types.FETCH_DATA}`,
//   items
// });

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
  console.log('>>>>> About to POST: ', items);
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
      console.log(message, 'Inserting: ', insertedIds, 'Deleting: ', deletedIds);
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

// export const addAction = (ruleId, branch) => ({   // NOT USED / clone row was used instead
//   ruleId,
//   branch,
//   type: `${branch}/${types.ADD_EMPTY_ROW}`
// });

/** Cloning the top version in the versions-list (max version) within a Rule (id). That's the 'item' */
export const cloneAction = (ruleId, item, branch) => async (dispatch) => {
  console.log('>>>>> About to clone and POST: ', item);

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
      item: Map(clonedRow), // Transforming item to Map, compatible w/ immutable.js
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

// export const updateAction = (ruleId, event, item, branch) => ({
//   ruleId,
//   branch,
//   type: `${branch}/${types.UPDATE_ROW}`,
//   event,
//   item
// });

export const updateAction = (ruleId, event, item, branch) => // updating (content, servers & tags) will NOT get stored in Mongo
  (dispatch, getState) => {
    const injectedServersConfig = getState().get('ServersConfig').get('dataTable'); // servers and tags config injected inside rules redux
    dispatch({
      ruleId,
      branch,
      type: `${branch}/${types.UPDATE_ROW}`,
      event,
      item,
      injectedServersConfig
    });
  };


export const updateRuleStatus = (ruleId, oldValue, branch) => async (dispatch) => {
  console.log('>>>>> About to update status and POST: ', oldValue);

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

// export const updateRuleStatus = (ruleId, oldValue, branch) =>
// ({
//   ruleId,
//   oldValue,
//   branch,
//   type: `${branch}/UPDATE_RULE_STATUS`,
// });

export const editAction = (ruleId, item, branch) => ({ // click-on-edit will NOT be stored in Mongo
  ruleId,
  branch,
  type: `${branch}/${types.EDIT_ROW}`,
  item
});

// SAVE version: Sync version
// export const saveAction = (ruleId, item, branch, content) => ({
//   ruleId,
//   branch,
//   type: `${branch}/${types.SAVE_ROW}`, // SAVE TO MONGO
//   item,
//   content
// });

/** Cloning the top version in the list (max version). That's the 'item' */
export const saveAction = (ruleId, item, branch, content) => async (dispatch) => {
  console.log('>>>>> About to update and POST: ', item);

  // Do the parsing here: we parse name, salience, status and content
  /* eslint-disable-next-line prefer-const */
  let { salience, ruleheader } = matchRulePattern(content)[0].groups; // TODO: we need dynamic TAGs matching and fetching
  // eslint-disable-next-line radix
  salience = parseInt(salience.trim().split(' ').last()) || 0;

  // Manipulating the cloned version: upgrading version, attaching timestamps, injecting current user
  const savedVersion = {
    version: item.get('version'),
    name: ruleheader, // newly parsed rule-name
    subOn: timestamp.utc('YYYY-MM-DD HH:mm'),
    subBy: 'sotirios@alpha', // TODO: Inject Logged in user from login reducer
    servers: item.get('servers'),
    tags: item.get('tags'),
    edited: false,
    salience, // newly parsed rule-salience
    content
  };
  const response = await fetch(`/api/version/update/${ruleId}/${item.get('version')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(savedVersion)
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
      item: Map(savedVersion), // Transforming item to Map, compatible w/ immutable.js
      branch,
      type: `${branch}/${types.SAVE_ROW}`, // SAVE TO MONGO
      content
    });
  }
};

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

// export const updateExpandedRows = (item, branch) => ({
//   branch,
//   type: `${branch}/UPDATE_EXPANDED`,
//   item
// });

