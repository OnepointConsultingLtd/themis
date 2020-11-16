import { fromJS, List } from 'immutable';
// import MenuContent from 'ba-api/menu'; // access to old static menu
import {
  TOGGLE_SIDEBAR,
  OPEN_SUBMENU,
  CHANGE_THEME,
  LOAD_PAGE
} from 'ba-actions/actionTypes';

const initialState = {
  menu: List([]),
  sidebarOpen: true,
  theme: 'purpleRedTheme',
  pageLoaded: false,
  palette: List([
    { name: 'Purple Red', value: 'purpleRedTheme' },
    { name: 'Natural Green Orange', value: 'greenTheme' },
    { name: 'Blue Ocean', value: 'blueTheme' },
    { name: 'Blue Sky', value: 'skyBlueTheme' },
    { name: 'Sweet Magenta Cyan', value: 'magentaTheme' },
    { name: 'Violet Green', value: 'purpleTheme' },
    { name: 'Vintage Yellow', value: 'yellowCyanTheme' },
    { name: 'Orange Violet', value: 'orangeTheme' },
    { name: 'Cyan Green', value: 'cyanTheme' },
    { name: 'Red Silver', value: 'redTheme' },
    { name: 'Grey', value: 'greyTheme' },
    { name: 'Green Nature', value: 'greenNatureTheme' },
  ]),
  subMenuOpen: []
};

const getMenus = menuArray => menuArray.map(item => {
  if (item.child) {
    return item.child;
  }
  return false;
});

const setNavCollapse = (menuContent, curRoute) => {
  const arr = getMenus(menuContent);
  let headMenu = 'not found';
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr[i].length; j += 1) {
      if (arr[i][j].link === curRoute) {
        headMenu = menuContent[i].key;
      }
    }
  }
  return headMenu;
};

const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case 'UPLOAD_MENU': // ---->  TODO: RENAME THIS TO READ_MENU
      return state.withMutations((mutableState) => {
        mutableState.set('menu', fromJS(action.menu));
      });
    case 'SAVE_MENU':
      return state.withMutations((mutableState) => {
        const indexToUpdate =
        state.getIn(['menu', 1, 'child']) // ATTENTION: "1" hardcoded is based on static menu items
          .findIndex(item => item.get('_id') === action.item.get('_id'));
        mutableState.update('menu', menu => menu.setIn([1, 'child', indexToUpdate], action.item));
      });
    case 'ADD_MENU':
      return state.withMutations((mutableState) => { // ATTENTION: "1" hardcoded is based on static menu items
        mutableState.updateIn(['menu', 1, 'child'], child => child.unshift(action.item));
      });
    case 'REMOVE_MENU':
      return state.withMutations((mutableState) => {
        const indexToRemove =
        state.getIn(['menu', 1, 'child']) // ATTENTION: "1" hardcoded is based on static menu items
          .findIndex(item => item.get('_id') === action.item.get('_id'));
        mutableState.updateIn(['menu', 1, 'child'], child => child.splice(indexToRemove, 1));
      });
    case TOGGLE_SIDEBAR:
      return state.withMutations((mutableState) => {
        mutableState.set('sidebarOpen', !state.get('sidebarOpen'));
      });
    case OPEN_SUBMENU:
      return state.withMutations((mutableState) => {
        // console.log('STATE MENU : ', state.get('menu'));
        // Set initial open parent menu
        const activeParent = setNavCollapse(
          state.get('menu'), // <---- load SideBar menu state here
          action.initialLocation
        );

        // Once page loaded will expand the parent menu
        if (action.initialLocation) {
          mutableState.set('subMenuOpen', List([activeParent]));
          return;
        }

        // Expand / Collapse parent menu
        const menuList = state.get('subMenuOpen');
        if (menuList.indexOf(action.key) > -1) {
          if (action.keyParent) {
            mutableState.set('subMenuOpen', List([action.keyParent]));
          } else {
            mutableState.set('subMenuOpen', List([]));
          }
        } else {
          mutableState.set('subMenuOpen', List([action.key, action.keyParent]));
        }
      });
    case CHANGE_THEME:
      return state.withMutations((mutableState) => {
        mutableState.set('theme', action.theme);
      });
    case LOAD_PAGE:
      return state.withMutations((mutableState) => {
        mutableState.set('pageLoaded', action.isLoaded);
      });
    default:
      return state;
  }
}
