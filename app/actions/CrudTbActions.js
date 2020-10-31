import axios from 'axios';
import * as types from './actionTypes';


// Async inject data from /api/:branch => v1.5
export const fetchAction = (branch) => async (dispatch) => {
  const response = await axios.get(`/api/${branch}/load`); // using axios to allow multiple body consumes!!
  console.log(response);
  if (response.status !== 200) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: `Could not load data from ${branch}`,
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

/** Create matrix record
 * @param {Array}: schema is the record's schema (columns') details (initial values)
 * @returns {Object}: new record w/ initial values */
const createNewRecord = (schema) => {
  const newRecord = schema
    .reduce((final, curr) => {
      if (curr.name !== 'id' && curr.name !== 'action') { // id and action columns are excluded
        return ({ ...final, [curr.name]: curr.initialValue });
      }
      return ({ ...final });
    }, {});
  // show new record in edit-mode
  newRecord.edited = true;
  // return the initial record
  return newRecord;
};

export const addAction = (schema, branch) => async (dispatch) => {
  // eslint-disable-next-line prefer-const
  let newRecord = createNewRecord(schema);
  console.log('>>> NEW RECORD: ', newRecord);
  const response = await axios.post(`/api/${branch}/create`, JSON.stringify(newRecord));
  if (response.status !== 200) { // Error handling
    dispatch({ // dispatch notification only
      branch, // dont forget to always dispatch branch, otherwise the store middleware cannot work
      type: `${branch}/SHOW_NOTIF`,
      message: 'Could not connect to the server',
      severity: 'error'
    });
  } else {
    console.log(response);
    // eslint-disable-next-line dot-notation
    newRecord['_id'] = response.data.insertedId; // receive _id from backend
    dispatch({
      newRecord,
      branch,
      type: `${branch}/${types.ADD_EMPTY_ROW}`,
    });
  }
};

export const removeAction = (item, branch) => async (dispatch) => {
  const response = await fetch(`/api/${branch}/delete/${item.get('_id')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
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
      branch,
      item,
      type: `${branch}/${types.REMOVE_ROW}`,
    });
  }
};
export const updateAction = (event, item, branch) => ({
  branch,
  type: `${branch}/${types.UPDATE_ROW}`,
  event,
  item
});
export const editAction = (item, branch) => ({
  branch,
  type: `${branch}/${types.EDIT_ROW}`,
  item
});
export const saveAction = (item, branch) => async (dispatch) => {
  const itemToBeEditted = { ...item.toJS() };
  delete itemToBeEditted._id; // items id is a string ; this conflicts w/ the DB's ObjectId
  itemToBeEditted.edited = false;
  const response = await fetch(`/api/${branch}/update/${item.get('_id')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(itemToBeEditted) // ATTENTION : remove _id from obejct
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
      branch,
      type: `${branch}/${types.SAVE_ROW}`,
      item
    });
  }
};

// Sync dispatches
// Old sync code => v0.1 & v1
// export const fetchAction = (items, branch) => ({
//   branch,
//   type: `${branch}/${types.FETCH_DATA}`,
//   items
// });
// export const addAction = (anchor, branch) => ({
//   branch,
//   type: `${branch}/${types.ADD_EMPTY_ROW}`,
//   anchor
// });
// export const removeAction = (item, branch) => ({
//   branch,
//   type: `${branch}/${types.REMOVE_ROW}`,
//   item
// });
// export const updateAction = (event, item, branch) => ({
//   branch,
//   type: `${branch}/${types.UPDATE_ROW}`,
//   event,
//   item
// });
// export const editAction = (item, branch) => ({
//   branch,
//   type: `${branch}/${types.EDIT_ROW}`,
//   item
// });
// export const saveAction = (item, branch) => ({
//   branch,
//   type: `${branch}/${types.SAVE_ROW}`,
//   item
// });
export const closeNotifAction = branch => ({
  branch,
  type: `${branch}/${types.CLOSE_NOTIF}`,
});
