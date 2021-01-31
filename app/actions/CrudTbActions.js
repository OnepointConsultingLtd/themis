import axios from 'axios';
import { fromJS } from 'immutable';
import generateSideMenu from 'ba-api/menu';
import * as types from './actionTypes';


// Async inject data from /api/:branch => v1.5
export const fetchAction = (branch) => async (dispatch) => {
  const response = await axios.get(`/api/${branch}/load`); // using axios to allow multiple body consumes!!
  // console.log(response);
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
    // -------------------------- ASYNC LOADING OF SIDEBAR MENU STATE --- IF branch IS GENERATORS_CONFIG
    if (branch === 'GeneratorsConfig') {
      // console.log('>>>>> RECIEIVING GENERATORS HERE: ', response.data);
      const injectedGeneratorsConfig = response.data;
      const menu = generateSideMenu( // send generators submenu to SideMenu factory
        injectedGeneratorsConfig // tap into generators cnfg. and load pinned-tags
          // .toJS() // dont forget, state is always immutable
          .map(item => ( // formulate the generators submenu array
            {
              _id: item._id,
              keyParent: 'dslr_generators',
              key: item.label,
              label: item.label,
              tags: item.tags,
              filterLogic: item.filterLogic,
              link: `/app/tables/generator/${item.label}`
            })));
      // console.log('>>>>>> About to dispatch MENU >>>>:', menu);
      dispatch({ // TODO: this dispatched action belongs originally to the UI-actions.js
        menu,
        type: 'UPLOAD_MENU'
      });
    }
    // ------------------------------------------------------------
  }
};

/** Creates a new "empty" (initial values) record based on the schema
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
    const newRecordWithID = { ...newRecord, _id: response.data.insertedId }; // receive _id from backend
    dispatch({
      newRecordWithID,
      branch,
      type: `${branch}/${types.ADD_EMPTY_ROW}`,
    });
    // -------------------------- ASYNC ADDING OF A SIDEBAR MENU ITEM --- IF branch IS GENERATORS_CONFIG
    if (branch === 'GeneratorsConfig') {
      newRecordWithID.link = `/app/tables/${newRecordWithID.label}`; // add link key
      newRecordWithID.keyParent = 'dslr_generators';
      newRecordWithID.key = newRecordWithID.label;
      dispatch({ // TODO: this dispatched action belongs originally to the UI-actions.js
        item: fromJS(newRecordWithID),
        type: 'ADD_MENU'
      });
    }
    // -------------------------------------------------------------------
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
    // -------------------------- ASYNC LOADING OF SIDEBAR MENU STATE --- IF branch IS GENERATORS_CONFIG
    if (branch === 'GeneratorsConfig') {
      dispatch({ // TODO: this dispatched action belongs originally to the UI-actions.js
        item,
        type: 'REMOVE_MENU'
      });
    }
    // -------------------------------------------------------------------
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

/** Dispatched redux action & Update Mongo-call upon finalising the record editing: SAVE
 *
*/
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
    // -------------------------- ASYNC LOADING OF SIDEBAR MENU STATE --- IF branch IS GENERATORS_CONFIG
    if (branch === 'GeneratorsConfig') {
      const edittedItem = item.toJS(); // convert item to JS object because unordered Maps cannot be added keys
      edittedItem.link = `/app/tables/generator/${item.get('label')}`; // add link key

      dispatch({ // TODO: this dispatched action belongs originally to the UI-actions.js
        item: fromJS(edittedItem),
        type: 'SAVE_MENU'
      });
    }
    // -------------------------------------------------------------------
  }
};

export const closeNotifAction = branch => ({
  branch,
  type: `${branch}/${types.CLOSE_NOTIF}`,
});
