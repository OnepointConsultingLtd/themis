/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { reducer as form } from 'redux-form/immutable';
import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';
import history from '../utils/history';

import languageProviderReducer from '../containers/LanguageProvider/reducer';
import ui from './modules/ui';
import login from './modules/login';
import initval from './modules/initForm';
import crudTable from './modules/crudTable';
import rulesTable from './modules/rulesTable';

/**
 * https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic
 */
function branchReducer(reducerFunction, reducerName) {
  return (state, action) => {
    const { branch } = action;
    const isInitializationCall = state === undefined;
    if (branch !== reducerName && !isInitializationCall) {
      return state;
    }
    return reducerFunction(state, action);
  };
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  const rootReducer = combineReducers({ // composing the App State Tree:
    form, // https://redux-form.com/8.3.0/examples/immutable/
    ui,
    initval,
    login,
    // {branch}: branchReducer(<state_handling_module>, '{branch}'),
    TagsConfig: branchReducer(crudTable, 'TagsConfig'),
    ServersConfig: branchReducer(crudTable, 'ServersConfig'),
    RulesManagerParentTable: branchReducer(rulesTable, 'RulesManagerParentTable'),
    router: connectRouter(history),
    language: languageProviderReducer,
    ...injectedReducers,
  });

  // Wrap the root reducer and return a new root reducer with router state
  const mergeWithRouterState = connectRouter(history);
  return mergeWithRouterState(rootReducer);
}
