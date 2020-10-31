import history from '../utils/history';

/* eslint-disable arrow-body-style */
export const loginAction = (userData) => { // <-------- TODO: wire server AUTH up here
//   window.location.href = '/app';
  history.push('/app/tables/rules-manager'); // redirect programmatically and thus save the state
  return ({ type: 'LOGIN', userData });
};
export const logoutAction = { type: 'LOGOUT' };
