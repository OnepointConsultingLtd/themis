import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import brand from 'ba-api/brand';
import logo from 'ba-images/logoThemis.png';
import logo2 from 'ba-images/theta-logo.png';
import {
  Hidden,
  Drawer,
  SwipeableDrawer
} from '@material-ui/core';
import ProjectSelector from './ProjectSelector';
import MainMenu from './MainMenu';
import styles from './sidebar-jss';
import './fonts.css';

/** Left sidebar, header-logo incl. */
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
        <div style={{ justifyContent: 'left' }}className={classNames(classes.brand, classes.brandBar, turnDarker && classes.darker)}>
          <img src={logo2} alt={brand.name} style={{ width: '150px', marginRight: '5px', marginTop: '5px' }} />
          {/* <h2 className="logo" style={{ marginTop: '14px' }}>{brand.name}</h2> */}
        </div>
        <div className={classNames(classes.profile, classes.user)}>
          <ProjectSelector classes={classes} />
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

export default withStyles(styles)(Sidebar);
