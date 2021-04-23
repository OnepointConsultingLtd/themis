import { fromJS, List, Map } from 'immutable';
import notif from './notifMessage';
import {
  FETCH_DATA,
  ADD_EMPTY_ROW,
  UPDATE_ROW,
  REMOVE_ROW,
  EDIT_ROW,
  SAVE_ROW,
  CLOSE_NOTIF
} from 'ba-actions/actionTypes';

const initialState = {
  dataTable: List([]),
  notifMsg: '',
};

const initialItem = (keyTemplate, anchor) => {
  const [...rawKey] = keyTemplate.keys();
  const staticKey = {
    id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
  };
  for (let i = 0; i < rawKey.length; i += 1) {
    if (rawKey[i] !== 'id' && rawKey[i] !== 'edited') {
      staticKey[rawKey[i]] = anchor[i].initialValue;
    }
  }
  // Push another static key
  staticKey.edited = true;

  return Map(staticKey);
};

const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  const { branch } = action;
  switch (action.type) {
    case `${branch}/${FETCH_DATA}`: // LOAD DATA INTO THE STATE
      return state.withMutations((mutableState) => {
        const items = fromJS(action.items);
        mutableState.set('dataTable', items);
      });
    case `${branch}/${ADD_EMPTY_ROW}`:
      return state.withMutations((mutableState) => {
        const raw = state.get('dataTable').last();
        const initial = initialItem(raw, action.anchor);
        mutableState.update('dataTable', dataTable => dataTable.unshift(initial));
      });
    case `${branch}/${REMOVE_ROW}`:
      return state.withMutations((mutableState) => {
        const index = state.get('dataTable').indexOf(action.item);
        mutableState
          .update('dataTable', dataTable => dataTable.splice(index, 1))
          .set('notifMsg', notif.removed);
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
        // console.log('Edit action on RULE: ', action.ruleId);
        const versionsListIndex = state.get('dataTable').find(rule => rule.get('_id') === action.ruleId).get('versions').indexOf(action.item);
        const rulesListIndex = state.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === action.ruleId));
        // console.log(index, action.item);
        mutableState.update('dataTable', dataTable => dataTable.get(rulesListIndex).set('versions', dataTable.find(rule => rule.get('_id') === action.ruleId).get('versions')
          .setIn([versionsListIndex, 'edited'], true))
        );
        // console.log(versionsListIndex, rulesListIndex, mutableState);
        // .update('dataTable', rules_list_index, rule => rule.get('versions')[versions_list_index].)

        // mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, dataTable.get(rulesListIndex).set('versions', dataTable.find(rule => rule.get('_id') === action.ruleId).get('versions')
        //   .setIn([versionsListIndex, 'edited'], true))])
        // );

        // mutableState.update(mutableState.get('dataTable').get(rulesListIndex).get('versions').get(versionsListIndex), item => item.set('edited', true));

        // console.log('>>> STATE GOT UPDATED: ', mutableState);
      });
    case `${branch}/${SAVE_ROW}`: // deactivating editing - NO UPDATE !!!
      return state.withMutations((mutableState) => {
        const index = state.get('dataTable').indexOf(action.item);
        mutableState
          .update('dataTable', dataTable => dataTable
            .setIn([index, 'edited'], false)
          )
          .set('notifMsg', notif.saved);
      });
    case `${branch}/${CLOSE_NOTIF}`:
      return state.withMutations((mutableState) => {
        mutableState.set('notifMsg', '');
      });
    default:
      return state;
  }
}
