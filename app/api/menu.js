/* eslint-disable arrow-body-style */
/* eslint-disable indent */
// import store from '../app'; // BUG: cyclical dependency --- fetch state from caller

const generateSideMenu = (generatorsConfig) => { // dynamic injection of generators screens
  // console.log('generatorsConfig: ', generatorsConfig);
  return ([
    // {
    //   key: 'rules',
    //   label: 'Rules',
    //   icon: 'library_books',
    //   child: [
        {
          key: 'dashboard_v1',
          label: 'Dashboard',
          link: '/app/dashboard'
        },
        // {
        //   key: 'basic_table',
        //   label: 'Basic Table',
        //   link: '/app/tables/basic-table'
        // },
        // {                  // TODO: it is broken, restore SelectionCell.js with old // I think this is done now
        //   key: 'crud_table',
        //   label: 'CRUD Table',
        //   link: '/app/tables/crud-table'
        // },
        {
          // keyParent: 'rules',
          key: 'rules_manager',
          label: 'Rules',
          link: '/app/tables/rules-manager'
        },
        {
          // keyParent: 'rules',
          key: 'dslr_generators',
          label: 'Deployers',
          // link: '/app/tables/dsl-generator',
          child: [...generatorsConfig]
        },
        {
          // keyParent: 'rules',
          key: 'configuration',
          label: 'Configuration',
          link: '/app/configuration'
        },
      // {
      //   key: 'reduxform',
      //   label: 'Redux Form',
      //   link: '/app/forms/reduxform'
      // },
      ]
    // },
  // {
  //   key: 'auth',
  //   label: 'Auth',
  //   icon: 'account_circle',
  //   child: [
  //     {
  //       key: 'login',
  //       label: 'Login',
  //       link: '/login'
  //     },
  //     {
  //       key: 'register',
  //       label: 'Register',
  //       link: '/register'
  //     },
  //     {
  //       key: 'reset',
  //       label: 'Reset Password',
  //       link: '/reset-password'
  //     },
  //   ]
  // },
  // {
  //   key: 'error',
  //   label: 'Error Pages',
  //   icon: 'error_outline',
  //   child: [
  //     {
  //       key: 'not_found_page',
  //       label: 'Not Found Page',
  //       link: '/app/pages/not-found'
  //     },
  //     {
  //       key: 'error_page',
  //       label: 'Error Page',
  //       link: '/app/pages/error'
  //     },
  //     {
  //       key: 'maintenance',
  //       label: 'Maintenance',
  //       link: '/maintenance'
  //     },
  //   ]
  // },
  // {
  //   key: 'menu_levels',
  //   label: 'Menu Levels',
  //   icon: 'sort',
  //   child: [
  //     {
  //       key: 'level_1',
  //       label: 'Level 1',
  //       link: '/#'
  //     },
  //     {
  //       key: 'level_2',
  //       keyParent: 'menu_levels',
  //       label: 'Level 2',
  //       child: [
  //         {
  //           key: 'sub_menu_1',
  //           label: 'Sub Menu 1',
  //           link: '/#'
  //         },
  //         {
  //           key: 'sub_menu_2',
  //           label: 'Sub Menu 2',
  //           link: '/#'
  //         },
  //       ]
  //     },
  //   ]
  // }
  // ]
  );
};
export default generateSideMenu;
