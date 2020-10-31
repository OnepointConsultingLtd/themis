/* eslint-disable arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import NotFound from '../Pages/Standalone/NotFoundDedicated';
import Auth from './Auth';
import Application from './Application';
import ThemeWrapper from './ThemeWrapper';
import history from '../../utils/history';
import LoginDedicated from '../Pages/Standalone/LoginDedicated';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends React.Component {
  render() {
    return (
      <ThemeWrapper>
        <Switch>
          <Route path="/" exact component={LoginDedicated} />
          <Route
            // exact // mandatory since /notfound has same root
            path="/app" // NEW: "/" with exact!   OLD: We try to route to "/app" tree
            render={({ location }) =>
              (Object.keys(this.props.login.toJS()).length !== 0 ? // USER AUTH CHECK
                <Application history={history} />
                :
                <Redirect to={{ // FAILED AUTH, REDIRECTING USER TO LOGIN SCREENS
                  pathname: '/login',
                  state: { from: location }
                }}
                />)
            }
          />
          {/* <Route path="/app" component={Application} /> */}
          <Route component={Auth} />      {/* LOGIN ROUTER */}
          <Route component={NotFound} />  {/* 404 SAFETY NET ROUTE */}
        </Switch>
      </ThemeWrapper>
    );
  }
}

App.propTypes = {
  login: PropTypes.object.isRequired
};

/**
 * Access to Incoming state (data)
 * @param {Object} state
 */
const mapStateToProps = state => {
  // console.log('>>>> State: ', state);
  // console.log('>>>> User details: ', state.getIn(['login', 'usersLogin']));
  return {
    force: state, // force state from reducer
    login: state.getIn(['login', 'usersLogin']) // tapping into logged-in user state-branch
  };
};

/**
 * Connecting state w/ props
 */
const AppState = connect(
  mapStateToProps,
  null // no actions to be dispatched
)(App);

export default AppState;
