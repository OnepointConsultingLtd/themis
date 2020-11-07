import React from 'react';
import { List } from 'immutable';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchAction } from 'ba-actions/RulesTableActions';
import * as crudActions from 'ba-actions/CrudTbActions';

import Dashboard from '../Templates/Dashboard';
import {
  DashboardV1, // Parent,
  /* SimpleTable, CrudTable, */ DSLGeneratorParentTable, RulesManagerParentTable, /* ReduxForm, */
  NotFound, Configuration, /* Error, */
} from '../pageListAsync';
// import { loadRules } from '../Tables/demos/data';


// Reducer Data Branches
const rulesStateBranch = 'RulesManagerParentTable';
const serversConfigStateBranch = 'ServersConfig';
const tagsConfigStateBranch = 'TagsConfig';
const generatorsConfigStateBranch = 'GeneratorsConfig';

class Application extends React.Component {
  componentDidMount() {
    // rules-data old sync injection => v0.1
    // this.props.fetchData(loadRules(), branch);

    // async middle-step => v1
    // fetch('/api/rules').then(response => response.json()).then(response => {
    //   this.props.fetchData(response, branch); // rules-data async injection
    // });

    // completed async data-injected in redux => v1.5  <redux-thunk>
    this.props.fetchData(rulesStateBranch);
    this.props.fetchServersConfig(serversConfigStateBranch);
    this.props.fetchTagsConfig(tagsConfigStateBranch);
    this.props.fetchGeneratorsConfig(generatorsConfigStateBranch);
    // console.log(this.props.history);
  }


  render() {
    // console.log('?????????  RENDERING ROUTER: ', this.props.generatorsMenu);
    return (
      <Dashboard history={this.props.history}>
        <Switch>
          <Route path="/app/configuration" component={Configuration} />
          {/* <Route path="/app/tables/dsl-generator" component={DSLGeneratorParentTable} /> */}
          <Route path="/app/tables/rules-manager" component={RulesManagerParentTable} />
          {
            (this.props.generatorsMenu || List([])).toJS().map(item =>
              (<Route
                path={item.link}
                component={() => (
                  <DSLGeneratorParentTable tags={item.tags} filterLogic={item.filterLogic} />
                )}
              />)
            )
          }
          <Route component={NotFound} />

          <Route path="/app/dashboard" component={DashboardV1} />
          {/* <Route exact path="/app/pages/error" component={Error} /> */}
          { /* Table */ }
          {/* <Route exact path="/app/tables" component={Parent} /> */}
          {/* <Route path="/app/tables/basic-table" component={SimpleTable} /> */}
          {/* <Route path="/app/tables/crud-table" component={CrudTable} /> */}
          { /* Form & Button */ }
          {/* <Route exact path="/app/forms" component={Parent} /> */}
          {/* <Route path="/app/forms/reduxform" component={ReduxForm} /> */}
          { /* Default */ }
        </Switch>
      </Dashboard>
    );
  }
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  fetchServersConfig: PropTypes.func.isRequired,
  fetchTagsConfig: PropTypes.func.isRequired,
  fetchGeneratorsConfig: PropTypes.func.isRequired,
  generatorsMenu: PropTypes.array.isRequired,
};

/**
 * Access to Incoming state (data)
 * @param {Object} state
 */
const mapStateToProps = state => ({
  force: state, // force state from reducer
  generatorsMenu: state.getIn(['ui', 'menu', 2, 'child']), // injecting ONLY generators sub-branch // mind the '2' hardcoding
});

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchAction, dispatch),
  fetchServersConfig: bindActionCreators(crudActions.fetchAction, dispatch),
  fetchTagsConfig: bindActionCreators(crudActions.fetchAction, dispatch),
  fetchGeneratorsConfig: bindActionCreators(crudActions.fetchAction, dispatch),
});

const ApplicationMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);

export default ApplicationMapped;

