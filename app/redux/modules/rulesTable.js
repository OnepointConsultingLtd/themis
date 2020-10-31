import { fromJS, List, /* OrderedSet, Map */ } from 'immutable';
// import timestamp from 'time-stamp';
import notif from 'ba-utils/notifMessage';
import {
  FETCH_DATA,
  // ADD_EMPTY_ROW,
  CLONE_MAX_VERSION,
  UPDATE_ROW,
  REMOVE_ROW,
  EDIT_ROW,
  SAVE_ROW,
  CLOSE_NOTIF
} from '../../actions/actionTypes';
// import { matchRulePattern } from '../../containers/Tables/demos/importRules';

const initialState = {
  dataTable: List([]),
  notifMsg: '',
  notifSeverity: '',
  // rowsExpanded: List([]),
  // serversList: List([])
  // versionPanelState:
};

// const emptyRow = (version) => // Decommissioned
//   (Map({
//     version,
//     name: 'This is a new version of....',
//     subOn: timestamp.utc('YYYY-MM-DD HH:mm'),
//     subBy: 'sotirios@alpha', // TODO: Logged in user
//     servers: ['NA'],
//     tags: [],
//     edited: false,
//     content: ''
//   }));

// const clonedRow = (item) =>    // moved one level upwards. inside actions
//   (Map({
//     version: item.get('version') + 1,
//     name: item.get('name'),
//     subOn: timestamp.utc('YYYY-MM-DD HH:mm'),
//     subBy: 'sotirios@alpha', // TODO: Logged in user
//     servers: ['NA'],
//     tags: item.get('tags'), // TODO: Should tags get cloned too ?
//     edited: false,
//     content: item.get('content')
//   }));

const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  const { branch } = action;
  switch (action.type) {
    /*
    LOAD DATA INTO STATE
    TODO: This will be converted to an event triger without any payload (only 'branch')
    It will just carry a signal that will triger the subscription to the server
    data stream. NOTE: we will need an extra triger called: STOP_FETCHING_DATA that
    will be called from the 'componentWillUnmount' event
    All this because we want the rules tables to be subscriptions to live streams!
    (rename this into START_FETCHING_DATA)
    */

    // case `${branch}/${FETCH_DATA}`:
    //   return state.withMutations((mutableState) => {
    //     const items = fromJS(action.items);
    //     mutableState.set('dataTable', items.sort());
    //   });

    case `${branch}/${FETCH_DATA}`: // Load rules
      return state.withMutations((mutableState) => {
        const items = fromJS(action.items);
        mutableState.set('dataTable', items);
      });

    // case `${branch}/${ADD_EMPTY_ROW}`: // Decommissioned
    //   return state.withMutations((mutableState) => {
    //     const rulesListIndex = mutableState.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === action.ruleId));
    //     const currentMaxVersion = mutableState.get('dataTable')
    //       .get(rulesListIndex)
    //       .get('versions')
    //       .first() // NOTE: this should be .first() if version order gets reversed
    //       .get('version');
    //     mutableState.updateIn(['dataTable', rulesListIndex, 'versions'], versions => versions.unshift(emptyRow(currentMaxVersion + 1))); // use unshift instead of push if version order will be reversed
    //     console.log(mutableState);
    //   });

    case `${branch}/${CLONE_MAX_VERSION}`: // Stack-up an advanced version (insert version on top)
      return state.withMutations((mutableState) => {
        console.log('>>>>> CLONED: ', action.item);
        const rulesListIndex = mutableState.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === action.ruleId));
        mutableState.updateIn(['dataTable', rulesListIndex, 'versions'], versions => versions.unshift(action.item)); // use unshift instead of push if version order will be reversed
      });

    // case `${branch}/${REMOVE_ROW}`: // Moved version removal higher to rule removal. See bellow
    //   return state.withMutations((mutableState) => {
    //     const versionsListIndex = state.get('dataTable').find(rule => rule.get('_id') === action.ruleId).get('versions').indexOf(action.item);
    //     const rulesListIndex = state.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === action.ruleId));
    //     mutableState
    //       .update('dataTable', dataTable => dataTable.removeIn([rulesListIndex, 'versions', versionsListIndex]))
    //       .set('notifMsg', notif.removed);
    //   });

    case `${branch}/${REMOVE_ROW}`: // Delete the whole rule
      return state.withMutations((mutableState) => {
        const rulesListIndex = state.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === action.ruleId));
        mutableState
          .update('dataTable', dataTable => dataTable.removeIn([rulesListIndex]))
          .set('notifMsg', notif.removed)
          .set('notifSeverity', 'success');
      });

    case `${branch}/${UPDATE_ROW}`: // continuous value UPDATE !!! currently only for SERVER-dropdown (CONTENT change would be too much to trigger updates per typed character)
      return state.withMutations((mutableState) => {
        const cellTarget = action.event.target.name;
        // const allServers = action.injectedServersConfig.map(server => server._id); // fetch list of servers _id's
        // const newVal = type => {
        //   if (type === 'checkbox') {
        //     return action.event.target.checked;
        //   }
        //   return action.event.target.value;
        // };

        // !!!!!!!!!!
        // TODO: Add live content and tags updates : these changes should be kept only in state and remain till user reloads page
        // NOTE: Content is kept in session but NOT parsed (salience remains as is unless user SAVES their changes)
        // !!!!!!!!!!
        const newVal = fromJS(action.event.target.value); // all server values are of JS type
        const versionsListIndex = state.get('dataTable').find(rule => rule.get('_id') === action.ruleId).get('versions').indexOf(action.item);
        const rulesListIndex = state.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === action.ruleId));
        mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'versions', versionsListIndex, cellTarget], newVal));

        // update available servers list interractively so all versions to get informed
        // const usedServers = mutableState.get('dataTable').find(rule => rule.get('_id') === action.ruleId).get('versions').map(version => version.get('servers'))
        //  .toJS()
        //  .flat(); // flattening array of arrays (selected servers is an array, dont forget)

        // const availableServers = OrderedSet(['PROD', 'PREP', 'TEST', 'DEV']).subtract(usedServers);
        // const availableServers = OrderedSet(allServers).subtract(usedServers); // <----- SERVER's LIST INJECTION ???? :/
        // mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'availableServers'], availableServers));
      });

    case `${branch}/UPDATE_RULE_STATUS`: // update rule status (toggle)
      return state.withMutations((mutableState) => {
        const { ruleId, oldValue } = action;
        const rulesListIndex = state.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === ruleId));
        mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'active'], !oldValue))
          .set('notifMsg', notif.status)
          .set('notifSeverity', 'success');
      });

    case `${branch}/${EDIT_ROW}`: // activate editing
      return state.withMutations((mutableState) => {
        const versionsListIndex = state.get('dataTable').find(rule => rule.get('_id') === action.ruleId).get('versions').indexOf(action.item);
        const rulesListIndex = state.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === action.ruleId));
        mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'versions', versionsListIndex, 'edited'], true));
      });

    case `${branch}/${SAVE_ROW}`: // deactivating editing and saving content - NO further UPDATES can be made until edit button is pressed !!!
      return state.withMutations((mutableState) => {
        const { ruleId, item, content } = action;
        const versionsListIndex = state.get('dataTable').find(rule => rule.get('_id') === ruleId).get('versions').findIndex(obj => obj.get('version') === item.get('version'));
        const rulesListIndex = state.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === ruleId));
        // Trigger re-parse! New content might be there that could include changes in: Tags and Salience. Before saving the rule we need to fetch those changes
        // console.log(matchRulePattern(content)[0].groups);
        /* eslint-disable-next-line prefer-const */
        // let { salience, ruleheader } = matchRulePattern(content)[0].groups; // TODO: we need dynamic TAGs matching and fetching
        // eslint-disable-next-line radix
        // salience = parseInt(salience.trim().split(' ').last()) || 0;
        // console.log('Salience Changed!:', salience);

        // TODO: Fetch and validate that ID remained intact --> This is SERIOUS
        // if (ruleId !== ruleid) {
        //   mutableState
        //     .set('notifMsg', 'ERROR: Version Rule ID does not match! Version cannot be saved');
        // } else {
        mutableState
          .update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'versions', versionsListIndex, 'edited'], false))
          .update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'versions', versionsListIndex, 'name'], item.get('name')))
          .update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'versions', versionsListIndex, 'salience'], item.get('salience')))
          .update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'versions', versionsListIndex, 'content'], content))
          .set('notifMsg', notif.saved)
          .set('notifSeverity', 'success');
        // }
      });

    case `${branch}/${CLOSE_NOTIF}`: // on close notif button
      return state.withMutations((mutableState) => {
        mutableState
          .set('notifMsg', ''); // empties the message and so it closes
      });

    case `${branch}/SHOW_NOTIF`:
      return state.withMutations((mutableState) => {
        console.log(action.message);
        mutableState
          .set('notifMsg', action.message)
          .set('notifSeverity', action.severity);
      });

    // case `${branch}/UPDATE_EXPANDED`:
    //   return state.withMutations((mutableState) => {
    //     mutableState.set('rowsExpanded', action.item);
    //   });

    case `${branch}/IMPORT_RULES`:
      return state.withMutations((mutableState) => {
        mutableState
          .update('dataTable', dataTable => dataTable
            .push(...fromJS(action.items // fromJS is needed because we are importing pure Array through shortcut (injecting the normal connect.store)
              .map((item, index) => ({ _id: action.insertedIds[index], ...item })) // assigning Mongo _id to each rule
              .filter(item => !action.deletedIds.includes(item._id))))) // filtering out all dup-deleted ones
          // .toSet()
          // .toList() // toSet().toList() remove silently all duplicate entries! TODO: How is dup defined?
          // .sort()) // sort the whole rules list // TODO: where is the sort-field: "name"?
          .set('notifMsg', action.message)
          .set('notifSeverity', 'success');
      });
    default:
      return state;
  }
}
