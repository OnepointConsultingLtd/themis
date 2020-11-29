import { Map, fromJS } from 'immutable';
// import { INIT } from 'ba-actions/actionTypes';

// const initialState = {
//   usersLogin: Map({
//     email: 'johndoe@mail.com',
//     password: '12345678',
//     remember: false
//   })
// };
const initialState = {
  usersLogin: Map({})
};
const initialImmutableState = fromJS(initialState);
export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case 'LOGIN':
      // console.log(action.userData.get('email'));
      if (action.userData.get('email').match(/.*?@onepoint.*?/)) { // (/.*?@onepointltd\.com/))
        return state.withMutations((mutableState) => {
          mutableState.set('usersLogin', action.userData);
        });
      }
      return state;

    case 'LOGOUT':
      return state.withMutations((mutableState) => {
        mutableState.set('usersLogin', initialState.usersLogin);
      });
    default:
      return state;
  }
}
