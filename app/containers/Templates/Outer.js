import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import brand from 'ba-api/brand';
import logo from 'ba-images/logo2.svg';
import { Hidden } from '@material-ui/core';
import styles from './appStyles-jss';

class Outer extends React.Component {
  render() {
    const {
      classes,
      children,
    } = this.props;
    return (
      <div className={classes.appFrameOuter}>
        <main className={classes.outerContent} id="mainContent">
          <Hidden mdUp>
            <div className={classes.brand}>
              <img src={logo} alt={brand.name} width="70" height="70" />
              <h3>{brand.name}</h3>
            </div>
          </Hidden>
          {children}
        </main>
      </div>
    );
  }
}

Outer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default (withStyles(styles)(Outer));
