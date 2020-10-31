import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import PapperBlock from 'ba-components/PapperBlock/PapperBlock';
// import { fetchAction } from 'ba-actions/CrudTbActions';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import CrudTable from '../../Tables/demos/CrudTable';
import { serversConfigSchema } from '../../Tables/demos/data';
// import { serversConfig } from './demos/data'; // v1  sync data injection

const styles = ({
  root: {
    flexGrow: 1,
  }
});

const branch = 'ServersConfig';

class ServersConfig extends Component { // TODO: class name is tricky,should rename
  // componentDidMount() { // v1  sync data injection
  //   this.props.fetchData(serversConfig, branch); // TODO: remove this after connection w/ server
  // }
  render() {
    return (
      <div>
        {/* <PapperBlock title="CRUD Table" desc="The CRUD Table supports editing features including creating, updating and deleting rows. The editing state contains information about rows currently being edited, changes applied to a particular row, and rows that have been deleted and created."> */}
        <CrudTable branch={branch} dataSchema={serversConfigSchema} /> {/* Reducer Branch */}
        {/* </PapperBlock> */}
      </div>
    );
  }
}

// ServersConfig.propTypes = { // TODO: remove this after connection w/ server
//   fetchData: PropTypes.func.isRequired,
// };

// const mapDispatchToProps = dispatch => ({// TODO: remove this after connection w/ server
//   fetchData: bindActionCreators(fetchAction, dispatch), // TODO: remove this after connection w/ server
// });

// const ServersConfigMapped = connect( // TODO: remove this after connection w/ server
//   null,
//   mapDispatchToProps
// )(ServersConfig);

// export default withStyles(styles)(crudTable);
export default withStyles(styles)(ServersConfig);
