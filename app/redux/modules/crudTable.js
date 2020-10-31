import { fromJS, List, Map } from 'immutable';
import notif from 'ba-utils/notifMessage';
import {
  FETCH_DATA,
  ADD_EMPTY_ROW,
  UPDATE_ROW,
  REMOVE_ROW,
  EDIT_ROW,
  SAVE_ROW,
  CLOSE_NOTIF
} from '../../actions/actionTypes';

const initialState = {
  dataTable: List([]),
  notifMsg: '',
  notifSeverity: ''
};

// /** keyTemplate is a samle record and anchor is the record's schema (columns') details (initial values) */
// const initialItem = (keyTemplate, schema) => {
//   // immutably load column names  (array copy)
//   const [...rawKey] = keyTemplate.keys();

//   // start composing the initial record
//   const newRecord = {
//     id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
//   };
//   for (let i = 0; i < rawKey.length; i += 1) {
//     if (rawKey[i] !== 'id' && rawKey[i] !== 'edited') {
//       newRecord[rawKey[i]] = schema[i].initialValue; // initialising crud table as group of initial-anchor values (anchor: crud column)
//     }
//   }

//   // Push another static key ---> Static key is a crud table record / rawKey is a crud-table column
//   newRecord.edited = true;

//   // return the initial record
//   return Map(newRecord);
// };

const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  const { branch } = action;
  switch (action.type) {
    case `${branch}/${FETCH_DATA}`:
      return state.withMutations((mutableState) => {
        const items = fromJS(action.items);
        mutableState.set('dataTable', items);
      });
    case `${branch}/${ADD_EMPTY_ROW}`:
      return state.withMutations((mutableState) => {
        // const raw = state.get('dataTable').last();
        // const initial = initialItem(raw, action.anchor);
        console.log(action.newRecord);
        mutableState.update('dataTable', dataTable => dataTable.unshift(Map(action.newRecord)));
      });
    case `${branch}/${REMOVE_ROW}`:
      return state.withMutations((mutableState) => {
        const index = state.get('dataTable').indexOf(action.item);
        mutableState
          .update('dataTable', dataTable => dataTable.splice(index, 1))
          .set('notifMsg', notif.removed)
          .set('notifSeverity', 'success');
      });
    case `${branch}/${UPDATE_ROW}`: // continuous value UPDATE !!!
      return state.withMutations((mutableState) => {
        const index = state.get('dataTable').indexOf(action.item);
        const cellTarget = action.event.target.name;
        const newVal = type => {
          if (type === 'checkbox') {
            return action.event.target.checked;
          }
          return action.event.target.value;
        };
        mutableState.update('dataTable', dataTable => dataTable
          .setIn([index, cellTarget], newVal(action.event.target.type))
        );
      });
    case `${branch}/${EDIT_ROW}`: // activate editing
      return state.withMutations((mutableState) => {
        const index = state.get('dataTable').indexOf(action.item);
        mutableState.update('dataTable', dataTable => dataTable
          .setIn([index, 'edited'], true)
        );
      });
    case `${branch}/${SAVE_ROW}`: // deactivating editing - NO UPDATE !!!
      return state.withMutations((mutableState) => {
        const index = state.get('dataTable').indexOf(action.item);
        mutableState
          .update('dataTable', dataTable => dataTable
            .setIn([index, 'edited'], false)
          )
          .set('notifMsg', notif.saved)
          .set('notifSeverity', 'success');
      });
    case `${branch}/${CLOSE_NOTIF}`:
      return state.withMutations((mutableState) => {
        mutableState.set('notifMsg', '');
      });
    case `${branch}/SHOW_NOTIF`:
      return state.withMutations((mutableState) => {
        console.log(action.message);
        mutableState
          .set('notifMsg', action.message)
          .set('notifSeverity', action.severity);
      });
    default:
      return state;
  }
}
