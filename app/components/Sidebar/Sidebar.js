import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import classNames from 'classnames';
import brand from 'ba-api/brand';
import dummy from 'ba-api/dummyContents';
import logo from 'ba-images/logo2.svg';
import {
  Hidden,
  Drawer,
  SwipeableDrawer,
  Avatar
} from '@material-ui/core';
import MainMenu from './MainMenu';
import styles from './sidebar-jss';
// import { uploadMenuAction } from '../../actions/UiActions';


const MenuContent = props => {
  const {
    classes,
    turnDarker,
    drawerPaper,
    toggleDrawerOpen,
    loadTransition
  } = props;
  return (
    <div className={classNames(classes.drawerInner, !drawerPaper ? classes.drawerPaperClose : '')}>
      <div className={classes.drawerHeader}>
        <div className={classNames(classes.brand, classes.brandBar, turnDarker && classes.darker)}>
          <img src={logo} alt={brand.name} width="80" />
          <h3>{brand.name}</h3>
        </div>
        <div className={classNames(classes.profile, classes.user)}>
          <Avatar
            alt={dummy.user.name}
            src={dummy.user.avatar}
            className={classNames(classes.avatar, classes.bigAvatar)}
          />
          <div>
            <h4>{dummy.user.name}</h4>
            <span>{dummy.user.title}</span>
          </div>
        </div>
      </div>
      <div className={classes.menuContainer}>
        <MainMenu loadTransition={loadTransition} toggleDrawerOpen={toggleDrawerOpen} />
      </div>
    </div>
  );
};

MenuContent.propTypes = {
  classes: PropTypes.object.isRequired,
  drawerPaper: PropTypes.bool.isRequired,
  turnDarker: PropTypes.bool,
  toggleDrawerOpen: PropTypes.func,
  loadTransition: PropTypes.func,
};

MenuContent.defaultProps = {
  turnDarker: false
};

MenuContent.defaultProps = {
  toggleDrawerOpen: () => {},
  loadTransition: () => {},
};

const MenuContentStyle = withStyles(styles)(MenuContent);

class Sidebar extends React.Component {
  state = {
    anchor: 'left'
  };

  // componentDidMount() {
  //   // Load menu content in redux
  //   this.props.loadMenu();
  // }

  render() {
    const { anchor } = this.state;
    const {
      classes,
      open,
      toggleDrawerOpen,
      loadTransition,
      turnDarker
    } = this.props;
    return (
      <Fragment>
        <Hidden lgUp>
          <SwipeableDrawer
            onClose={toggleDrawerOpen}
            onOpen={toggleDrawerOpen}
            open={!open}
            anchor={anchor}
          >
            <div className={classes.swipeDrawerPaper}>
              <MenuContentStyle drawerPaper toggleDrawerOpen={toggleDrawerOpen} loadTransition={loadTransition} />
            </div>
          </SwipeableDrawer>
        </Hidden>
        <Hidden mdDown>
          <Drawer
            variant="permanent"
            onClose={toggleDrawerOpen}
            classes={{
              paper: classNames(classes.drawer, classes.drawerPaper, !open ? classes.drawerPaperClose : ''),
            }}
            open={open}
            anchor={anchor}
          >
            <MenuContentStyle drawerPaper={open} turnDarker={turnDarker} loadTransition={loadTransition} />
          </Drawer>
        </Hidden>
      </Fragment>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleDrawerOpen: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  turnDarker: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  // loadMenu: PropTypes.func.isRequired
};

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
// const mapDispatchToProps = dispatch => ({
//   loadMenu: bindActionCreators(uploadMenuAction, dispatch)
// });

// const SidebarMapped = connect(
//   null,
//   mapDispatchToProps
// )(Sidebar);

export default withStyles(styles)(Sidebar);
