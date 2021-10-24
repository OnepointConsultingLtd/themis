import React from 'react';
import { List } from 'immutable';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchAction } from 'ba-actions/RulesTableActions';
import { fetchAction as fetchConfig } from 'ba-actions/CrudTbActions';
import Dashboard from '../Templates/Dashboard';
import {
  DashboardV1, DSLGeneratorParentTable, RulesManagerParentTable,
  NotFound, Configuration
} from '../pageListAsync';

// import DSLGeneratorParentTable from '../Tables/DSLGeneratorParentTable';
// import RulesManagerParentTable from '../Tables/RulesManagerParentTable';

// import Configuration from '../Configuration';
// import NotFound from '../NotFound/NotFound';


// Reducer Data Branches
const rulesStateBranch = 'RulesManagerParentTable';
const serversConfigStateBranch = 'ServersConfig';
const tagsConfigStateBranch = 'TagsConfig';
const generatorsConfigStateBranch = 'GeneratorsConfig';

class Application extends React.Component {
  componentDidMount() {
    this.props.fetchRules(rulesStateBranch);
    this.props.fetchConfig(serversConfigStateBranch);
    this.props.fetchConfig(tagsConfigStateBranch);
    this.props.fetchConfig(generatorsConfigStateBranch);
  }

  render() {
    return (
      <Dashboard history={this.props.history}>
        <Switch>
          <Route path="/app/dashboard" component={DashboardV1} />
          <Route path="/app/configuration" component={Configuration} />
          <Route path="/app/tables/rules-manager" component={RulesManagerParentTable} />
          {
            (this.props.generatorsMenu || List([])).map(item =>
              (<Route
                path={item.get('link')}
                component={() => (
                  <DSLGeneratorParentTable tags={item.get('tags')} filterLogic={item.get('filterLogic')} />
                )}
              />)
            )
          }
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
  fetchRules: PropTypes.func.isRequired,
  fetchConfig: PropTypes.func.isRequired,
  generatorsMenu: PropTypes.array.isRequired,
};

/**
 * Access to Incoming state (data)
 * @param {Object} state
 */
const mapStateToProps = state => ({
  force: state, // force state from reducer
  generatorsMenu: state.getIn(['ui', 'menu', 2, 'child']), // injecting ONLY generators sub-branch // !!!! ATTENTION TODO mind the '2' hardcoding
});

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => ({
  fetchRules: bindActionCreators(fetchAction, dispatch),
  fetchConfig: bindActionCreators(fetchConfig, dispatch),
});

const ApplicationMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Application);

export default ApplicationMapped;

