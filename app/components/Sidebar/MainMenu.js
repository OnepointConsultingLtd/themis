import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ExpandMore from '@material-ui/icons/ExpandMore';
// Menu Object
// import generateSideMenu from 'ba-api/menu'; // transfered mnu generation to reducer actions
import {
  List, ListItem, ListItemIcon,
  ListItemText, Collapse, Icon
} from '@material-ui/core';
import styles from './sidebar-jss';


function sortByKey(array, key) {
  return array.sort((a, b) => {
    const x = a[key]; const y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { 
  return <NavLink to={props.to} {...props} innerRef={ref} />; 
});

class MainMenu extends React.Component { 

  handleClick = () => {
    this.props.toggleDrawerOpen();
    this.props.loadTransition(false);
  }

  render() {
    const {
      classes,
      // openSubMenu,
      open,
      menu
    } = this.props;

    const getMenus = menuArray => menuArray
      .filter(item => item.label !== '' && item.label !== undefined) // filter-out any empty labeled generation screen
      .map((item, index) => {
        // console.log('>>>>>> NEW ARRAY TO RENDER: ', item);
        // if item has children
        if (item.child) {
          return (
            <div key={index.toString()}>
              <ListItem
                // button
                className={classNames(open.indexOf(item.key) > -1 ? classes.opened : '')}
                // onClick={() => openSubMenu(item.key, item.keyParent)}
              >
                {item.icon
                  && (
                    <ListItemIcon className={classes.iconWrapper}>
                      <Icon className={classes.icon}>{item.icon}</Icon>
                    </ListItemIcon>
                  )
                }
                <ListItemText classes={{ primary: classes.primary }} variant="inset" primary={item.label} />
                {/* { open.indexOf(item.key) > -1 ? <ExpandLess /> : <ExpandMore /> } */}
                <ExpandMore />
              </ListItem>

              {/* COLLAPSED CHILDREN ----------------------------------- */}
              <Collapse
                component="li"
                className={classNames(
                  classes.nolist, classes.child
                  // (item.keyParent ? classes.child : ''),
                )}
                in
                timeout="auto"
                unmountOnExit
              >
                <List className={classes.dense} style={{ paddingLeft: '20px' }} dense>
                  { getMenus(sortByKey(item.child, 'key')) }
                </List>
              </Collapse>
              {/* COLLAPSED CHILDREN ----------------------------------- */}

            </div>
          );
        }
        //    ={open.indexOf(item.key) > -1}
        // Else if item does not have children
        return (
          <ListItem
            key={index.toString()}
            button
            exact
            // className={classes.nested}
            activeClassName={classes.active}
            component={LinkBtn}
            to={item.link}
            onClick={this.handleClick}
          >
            {item.icon
              && (
                <ListItemIcon>
                  <Icon className={classes.icon}>{item.icon}</Icon>
                </ListItemIcon>
              )
            }
            <ListItemText classes={{ primary: classes.primary }} primary={item.label} />
          </ListItem>
        );
      });
    return (
      <div>
        {/* INJECTING MENU STATE INTO SIDEBAR */}
        {getMenus(menu.toJS())}
      </div>
    );
  }
}

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  // openSubMenu: PropTypes.func.isRequired,
  toggleDrawerOpen: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  menu: PropTypes.array.isRequired,
};

const openAction = (key, keyParent) => ({ type: 'OPEN_SUBMENU', key, keyParent });
const reducer = 'ui';

const mapStateToProps = (state) => ({
  force: state, // force active class for sidebar menu
  open: state.getIn([reducer, 'subMenuOpen']),
  menu: state.getIn([reducer, 'menu']),
});

const mapDispatchToProps = (dispatch) => ({
  openSubMenu: bindActionCreators(openAction, dispatch),
});

const MainMenuMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);

export default withStyles(styles)(MainMenuMapped);
