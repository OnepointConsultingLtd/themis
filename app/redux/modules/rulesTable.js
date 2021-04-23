import { fromJS, List, /* , OrderedSet Map */ } from 'immutable';
// import timestamp from 'time-stamp';
import notif from './notifMessage';
import {
  FETCH_DATA,
  // ADD_EMPTY_ROW,
  CLONE_MAX_VERSION,
  // UPDATE_ROW,
  REMOVE_ROW,
  EDIT_ROW,
  SAVE_ROW,
  CLOSE_NOTIF
} from 'ba-actions/actionTypes';
// import { matchRulePattern } from '../../containers/Tables/demos/importRules';

const initialState = {
  dataTable: List([]),
  notifMsg: '',
  notifSeverity: '',
  rowsSelected: List([])
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

// const clonedRow = (item) =>    // moved one level upwards. inside actions as we need to send it to DB from that level
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
    TODO V3: This will be converted to an event triger without any payload (only 'branch')
    It will just carry a signal that will triger the subscription to the server
    data stream. NOTE: we will need an extra triger called: STOP_FETCHING_DATA that
    will be called from the 'componentWillUnmount' event
    All this because we want the rules tables to be live subscriptions to streams!
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

    case `${branch}/${CLONE_MAX_VERSION}`: // Stack-up an advanced version (insert a new version on top)
      return state.withMutations((mutableState) => {
        const { ruleId } = action;
        const rulesListIndex = state.get('dataTable').findIndex(ruleRecord => ruleRecord.get('_id') === ruleId);
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
        const { ruleId } = action;
        const rulesListIndex = state.get('dataTable').findIndex(ruleRecord => ruleRecord.get('_id') === ruleId);
        mutableState
          .update('dataTable', dataTable => dataTable.removeIn([rulesListIndex]))
          .set('notifMsg', notif.removed)
          .set('notifSeverity', 'success');
      });

    // DECOMMISSIONED: No update rule action anymore
    // case `${branch}/${UPDATE_ROW}`: // continuous value (versions: server/tag) UPDATE !!! currently only for SERVER-dropdown (CONTENT change would be too much to trigger updates per typed character)
    //   return state.withMutations((mutableState) => {
    //     const cellTarget = action.event.target.name;
    //     // const allServers = action.injectedServersConfig.map(server => server._id); // fetch list of servers _id's
    //     // const newVal = type => {
    //     //   if (type === 'checkbox') {
    //     //     return action.event.target.checked;
    //     //   }
    //     //   return action.event.target.value;
    //     // };

    //     // !!!!!!!!!!
    //     // TODO: Add live content and tags updates : these changes should be kept only in state and remain till user reloads page
    //     // NOTE: Content is kept in session but NOT parsed (salience remains as is unless user SAVES their changes)
    //     // !!!!!!!!!!
    //     const newVal = fromJS(action.event.target.value); // all server values are of JS type
    //     const rulesListIndex = state.get('dataTable').indexOf(state.get('dataTable').find(rule => rule.get('_id') === action.ruleId));
    //     const versionsListIndex = state.get('dataTable').find(rule => rule.get('_id') === action.ruleId).get('versions').indexOf(action.item);

    //     // remove selected server(s) (!) from other versions
    //     if (cellTarget === 'servers') {
    //       const versionsArray = state.getIn(['dataTable', rulesListIndex]).get('versions');
    //       // newVal is an array of selected server _ids. Subtract these selected server(s) from any other verions one-by-one
    //       newVal.forEach(selectedServer => {
    //         const whichVersionIndexHasThisServer = versionsArray.findIndex(version => version.get('servers').includes(selectedServer));
    //         // found servers in other versions. Let's remove them
    //         if (whichVersionIndexHasThisServer > -1) {
    //           const whichServersDoesItHave = versionsArray.getIn([whichVersionIndexHasThisServer, 'servers']);
    //           // removing them via subrtaction!
    //           const newServersAfterSubtraction = OrderedSet(whichServersDoesItHave).subtract([selectedServer]); // NOTE!: SUBTRACT always works with arrays
    //           // Applying changes in state
    //           mutableState.update('dataTable', dataTable =>
    //             dataTable.setIn([rulesListIndex, 'versions', whichVersionIndexHasThisServer, 'servers'], newServersAfterSubtraction));
    //         }
    //       });
    //     }
    //     // assign selected server/tag to version
    //     mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'versions', versionsListIndex, cellTarget], newVal));

    // update available servers list interractively so all versions to get informed
    // const usedServers = mutableState.get('dataTable').find(rule => rule.get('_id') === action.ruleId).get('versions').map(version => version.get('servers'))
    //  .toJS()
    //  .flat(); // flattening array of arrays (selected servers is an array, dont forget)

    // const availableServers = OrderedSet(['PROD', 'PREP', 'TEST', 'DEV']).subtract(usedServers);
    // const availableServers = OrderedSet(allServers).subtract(usedServers); // <----- SERVER's LIST INJECTION ???? :/
    // mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'availableServers'], availableServers));
    // });

    case `${branch}/UPDATE_RULE_STATUS`: // update rule status (toggle)
      return state.withMutations((mutableState) => {
        const { ruleId, newValue } = action;
        const rulesListIndex = state.get('dataTable').findIndex(ruleRecord => ruleRecord.get('_id') === ruleId);
        mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'active'], newValue))
          .set('notifMsg', notif.status)
          .set('notifSeverity', 'success');
      });

    case `${branch}/UPDATE_RULE_TAGS`: // update rule tags
      return state.withMutations((mutableState) => {
        const { ruleId, newValue } = action;
        const rulesListIndex = state.get('dataTable').findIndex(ruleRecord => ruleRecord.get('_id') === ruleId);
        mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'tags'], newValue))
          .set('notifMsg', 'Tags have updated successfully')
          .set('notifSeverity', 'success');
      });

    case `${branch}/${EDIT_ROW}`: // activate editing
      return state.withMutations((mutableState) => {
        const { ruleId } = action;
        const versionsListIndex = state.get('dataTable').find(rule => rule.get('_id') === action.ruleId).get('versions').indexOf(action.item);
        const rulesListIndex = state.get('dataTable').findIndex(ruleRecord => ruleRecord.get('_id') === ruleId);
        mutableState.update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'versions', versionsListIndex, 'edited'], true));
      });
    case `${branch}/DISCARD_ROW`: // deactivate editing, discard any changes
      return state.withMutations((mutableState) => {
        const { ruleId } = action;
        const versionsListIndex = state.get('dataTable').find(rule => rule.get('_id') === action.ruleId).get('versions').indexOf(action.item);
        const rulesListIndex = state.get('dataTable').findIndex(ruleRecord => ruleRecord.get('_id') === ruleId);
        mutableState
          .update('dataTable', dataTable => dataTable.setIn([rulesListIndex, 'versions', versionsListIndex, 'edited'], false))
          .set('notifMsg', 'Discarded any changes')
          .set('notifSeverity', 'success');
      });
    case `${branch}/${SAVE_ROW}`: // deactivating editing and saving content - NO further UPDATES can be made until edit button is pressed again
      return state.withMutations((mutableState) => {
        const { rule } = action;
        // console.log('>> SAVING RULE IN STATE: ', rule);
        const rulesListIndex = state.get('dataTable').findIndex(ruleRecord => ruleRecord.get('_id') === rule.get('_id'));
        mutableState
          .setIn(['dataTable', rulesListIndex], rule)
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

    // case `${branch}/UPDATE_EXPANDED`:
    //   return state.withMutations((mutableState) => {
    //     mutableState.set('rowsExpanded', action.item);
    //   });

    case `${branch}/UPDATE_SELECTED_ROWS`:
      return state.withMutations((mutableState) => {
        mutableState.set('rowsSelected', action.item);
      });

    // ----------------------------------------------> BULK ACTIONS
    case `${branch}/BULK_DEACTIVATE`:
      return state.withMutations((mutableState) => {
        mutableState
          .update('dataTable', dataTable =>
            dataTable.map(rule => {
              if (action.bulkIds.includes(rule.get('_id')) && rule.get('active')) {
                return rule.set('active', false);
              }
              return rule;
            })
          )
          .set('notifMsg', action.message)
          .set('notifSeverity', 'success');
      });
    case `${branch}/BULK_ACTIVATE`:
      return state.withMutations((mutableState) => {
        mutableState
          .update('dataTable', dataTable =>
            dataTable.map(rule => {
              if (action.bulkIds.includes(rule.get('_id')) && !rule.get('active')) {
                return rule.set('active', true);
              }
              return rule;
            })
          )
          .set('notifMsg', action.message)
          .set('notifSeverity', 'success');
      });
    case `${branch}/BULK_DELETE`:
      return state.withMutations((mutableState) => {
        mutableState
          .update('dataTable', dataTable =>
            dataTable.filterNot(rule => action.bulkIds.includes(rule.get('_id'))
            ))
          .set('notifMsg', action.message)
          .set('notifSeverity', 'success');
      });
    case `${branch}/BULK_UPDATE_TAGS`:
      return state.withMutations((mutableState) => {
        mutableState
          .update('dataTable', dataTable =>
            dataTable.map(rule => {
              if (action.bulkIds.includes(rule.get('_id'))) {
                return rule.set('tags', action.tags);
              }
              return rule;
            })
          )
          .set('notifMsg', action.message)
          .set('notifSeverity', 'success');
      });
    // <--------------------------------------------- BULK ACTIONS
    default:
      return state;
  }
}
