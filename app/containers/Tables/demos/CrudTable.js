import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  // fetchAction, // TODO after connection to server uncomment fetchAction
  addAction,
  removeAction,
  updateAction,
  editAction,
  saveAction,
  closeNotifAction,
} from 'ba-actions/CrudTbActions';
import CrudTable from 'ba-components/Tables/CrudTable';
import Notification from 'ba-components/Notification/Notification';
// import { anchorTable, dataApi } from './data';

const styles = ({
  root: {
    flexGrow: 1,
  }
});

class CrudTableDemo extends Component {
  // componentDidMount() { // TODO after connection to server uncomment fetchAction
  //   this.props.fetchData(dataApi, this.props.branch); // performs data-loading, it will send only branch in the future
  // }

  render() {
    const {
      branch,
      // fetchData,
      dataSchema,
      addEmptyRow,
      dataTable,
      removeRow,
      updateRow,
      editRow,
      finishEditRow,
      closeNotif,
      messageNotif,
      severityNotif
    } = this.props;
    console.log('>>> DATA ARRIVED IN: ', branch, dataTable);
    return (
      <div>
        <Notification close={() => closeNotif(branch)} message={messageNotif} severity={severityNotif} />
        <CrudTable
          schema={dataSchema}
          title="Inventory"
          dataTable={dataTable}
          // fetchData={fetchData}
          addEmptyRow={addEmptyRow}
          removeRow={removeRow}
          updateRow={updateRow}
          editRow={editRow}
          finishEditRow={finishEditRow}
          branch={branch}
        />
      </div>

    );
  }
}

CrudTableDemo.propTypes = {
  branch: PropTypes.string.isRequired,
  dataSchema: PropTypes.array.isRequired,
  // fetchData: PropTypes.func.isRequired,
  dataTable: PropTypes.object.isRequired,
  addEmptyRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  updateRow: PropTypes.func.isRequired,
  editRow: PropTypes.func.isRequired,
  finishEditRow: PropTypes.func.isRequired,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  severityNotif: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({ // own props used to access props and fetch branch
  force: state, // force state from reducer
  dataTable: state.getIn([ownProps.branch, 'dataTable']),
  messageNotif: state.getIn([ownProps.branch, 'notifMsg']),
  severityNotif: state.getIn([ownProps.branch, 'notifSeverity']),
});

const mapDispatchToProps = dispatch => ({
  // fetchData: bindActionCreators(fetchAction, dispatch),
  addEmptyRow: bindActionCreators(addAction, dispatch),
  removeRow: bindActionCreators(removeAction, dispatch),
  updateRow: bindActionCreators(updateAction, dispatch),
  editRow: bindActionCreators(editAction, dispatch),
  finishEditRow: bindActionCreators(saveAction, dispatch),
  closeNotif: bindActionCreators(closeNotifAction, dispatch),
});

const CrudTableMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CrudTableDemo);

export default withStyles(styles)(CrudTableMapped);
