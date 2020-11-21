/* eslint-disable react/sort-comp */
/* eslint-disable no-else-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-sequences */
/* eslint-disable react/no-unused-state */
/* eslint-disable arrow-body-style */
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-vars */
// eslint-disable arrow-body-style
// eslint-disable-next-line class-methods-use-this
// eslint-disable-next-line no-unused-vars
import React from 'react';
// import { List } from 'immutable';
// import { Map } from 'immutable';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';
// import BlockIcon from '@material-ui/icons/Block';
// import Grow from '@material-ui/core/Grow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DeleteIcon from '@material-ui/icons/Delete';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  closeNotifAction,
  // updateExpandedRows,
  updateRuleStatus,
  removeAction,
} from 'ba-actions/RulesTableActions';
import Notification from 'ba-components/Notification/Notification';
import CustomToolbarSelect from './demos/CustomToolbarSelect';
import RulesManagerNestedVersionsPanel from './demos/RulesManagerNestedVersionsPanel';
import { aggregateMaxVersions, fetchRuleFullDetails, findLockedAndDeactivatedRules } from './demos/data';
import CustomToolbar from './demos/CustomToolbar';
import PopUp from './demos/PopUp';
import { ImportRules, ImportCreatedRule } from './demos/importRules';
import { idsToLabels } from './demos/idsToProperties';
import { renderServersChips, renderTagsChips } from './demos/renderChipLabelsFromIds';
import filterOptions from './demos/filterLogic';

// Reducer Branch
const branch = 'RulesManagerParentTable';

/*
  It uses npm mui-datatables. It's easy to use, you just describe columns and data collection.
  Checkout full documentation here :
  https://github.com/gregnb/mui-datatables/blob/master/README.md
*/
class RulesManagerParentTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsExpanded: [],
      // lockedRows: [],
      // deactivatedRows: [],
      deletedRuleId: '',
      deletedRuleRowIndex: '',
      popUp: {
        status: false,
        type: '',
        text: ''
      }
    };
    console.log('Instansiating Rules MS'); // TODO, call is perfomed twice . Why ?
  }


  /**
   * Action to perform when user clicks CANCEL in the popup
   */
  onPopUpClose = () => {
    this.setState({ popUp: { status: false } });
  };

  /**
   * Filter top popup was too narrow. needed some space
   * Overriding default styling
   */
  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableFilter: {
        root: {
          width: '500px'
        }
      }
    }
  });

  setCellProps = (row, dataIndex, rowIndex) => {
    if ((this.lockedRows || []).includes(dataIndex) || (this.deactivatedRows || []).includes(dataIndex)) {
      return {
        style: { color: '#aaa' }
      };
    }
    return true;
  };

  /**
   * Deleting a Rule and refreshing the expanded rows by renumbering them
   * @param {string} ruleId is the to-be-deleted rule id
   * @param {integer} rowIndex is the absolute DataIndex of the rule (index inside DataArray)
  */
  eventDel = (deletedRuleId, deletedRuleRowIndex) => (e) => {
    e.stopPropagation();
    // Launch confirmation pop-up
    this.setState({ popUp: { status: true, type: 'confirm delete', text: '' } });
    this.setState({ deletedRuleId, deletedRuleRowIndex });
  };

  onConfirmDeleteRule = () => {
    // BUG: when removing a rule while expanded, browser crashes (DOM node is destroyed)
    // DEBUGGED: collapse rule before removing (thus removing DOM-node before deleting it)
    const expandedRowsArray = [...this.state.rowsExpanded.sort()]; // need sort because expanded-array is in historical order
    const expandedRowsArrayIndexOf = expandedRowsArray.indexOf(this.state.deletedRowIndex);

    // first check if the to-be-deleted row is expanded
    if (expandedRowsArrayIndexOf !== -1) {
      expandedRowsArray.splice(expandedRowsArrayIndexOf, 1);
      this.setState({ rowsExpanded: expandedRowsArray }); // collapse before deletion
    }

    // Rule deletion
    this.props.removeRow(this.state.deletedRuleId, branch);
    // after deletion, renumber expanded rows indices after the deleted index (all indices are absolute)
    const expandedRowsArray2 = expandedRowsArray.map((item, index) => {
      if (index >= expandedRowsArrayIndexOf) { console.log('returning renumbered', item - 1); return (item - 1); }
      return item;
    });
    this.setState({ rowsExpanded: expandedRowsArray2 });
  }

  stopPropagation = (e) => { e.stopPropagation(); }

  /**
   * Renders a single rule's multi-versions panel
   * @param {Object} rowData: A single row's data containing Rule ID, and maxVersion's details: Title, Server's etc
   * We need Rule's ID for quering rule's full details
   */
  renderCollapseVersionsPanel = (rowData) => {
    const colSpan = rowData.length + 1;
    const inlineStyle = {
      animation: '0.8s ease-out fadeIn 1',
      backgroundColor: 'rgb(240, 240, 240)',
    };
    const inEffect = `
    @keyframes fadeIn {
      0%   { opacity: 0; }
      50%  { opacity: 0; }
      100% { opacity: 1; }
    }
  `;
    // Making sure that the rule is there (and not got deleted or somthing)  BUG: renumber and re-expand rules
    const findRule = this.props.dataTable.find(rule => rule.get('_id') === rowData[0]);
    if (findRule) {
      return (
      // <Grow in style={{ transformOrigin: '50% 0 0' }} {...{ timeout: 1000 }}>
        <TableRow>
          <style>
            {inEffect}
          </style>
          <TableCell colSpan={colSpan} style={inlineStyle} id={'expandedRow' + rowData[0]} >
            <RulesManagerNestedVersionsPanel
            // ruleData={fetchRuleFullDetails(this.props.dataTable.toJS(), rowData[0])} // Rule query
              ruleData={findRule} // Rule query
              branch={branch}
              maxVersion={rowData[1]}
              // availableServers={(this.props.dataTable.find(rule => rule.get('_id') === rowData[0]) || Map({ availableServers: '' })).get('availableServers')}
            />
          </TableCell>
        </TableRow>
      // </Grow>
      );
    }
    return (<div />); // rule was not there so render nothing
  }

  onChangeRuleStatus = (ruleId, ruleStatus, updateValue) => (e) => {
    e.stopPropagation();
    updateValue(e.target.value !== 'Yes');
    this.props.updateRuleStatus(ruleId, ruleStatus, branch);
  }

  renderCRUDActionsColumn = (value, tableMeta, updateValue) => {
    let disabled;
    if ((this.lockedRows || []).includes(tableMeta.rowIndex)) {
      disabled = true; // prevent current user from deleting or changing locked-rules status
    } else disabled = false;
    return (
      <div>
        <FormControlLabel
        // label={value ? 'Yes' : 'No'}
          disabled={disabled}
          value={value ? 'Yes' : 'No'}
          control={
            <Switch
              color="primary"
              checked={value}
              value={value ? 'Yes' : 'No'}
            />
          }
          onClick={this.stopPropagation}
          onChange={this.onChangeRuleStatus(tableMeta.rowData[0], tableMeta.rowData[5], updateValue)}
        />
        <IconButton
          onClick={this.eventDel(tableMeta.rowData[0], tableMeta.rowIndex)}
          disabled={disabled}
          aria-label="Delete"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }

  renderServersColumn = (value, tableMeta) => renderServersChips(this.props.allServers, value, tableMeta, this.lockedRows) // render as chips

  renderTagsColumn = (value, tableMeta) => renderTagsChips(this.props.allTags, value, tableMeta, this.lockedRows) // render as chips

  isRowExpandableLogic = (dataIndex, expandedRows) => {
    if (this.lockedRows.includes(dataIndex)) return false; // prevent locked rules from expanding
    return true;
  };

  // Expansion is based on row.dataIndex and not on row.index (absolute index=>dataIndex over displayed data index=>index)
  onRowExpansionChangeLogic = (curExpanded, allRowsExpanded, rowsExpanded) => {
    this.setState({ rowsExpanded: allRowsExpanded.map(row => row.dataIndex) });
  }

  render() {

    const {
      dataTable,
      closeNotif,
      messageNotif,
      severityNotif,
      allServers,
      allTags
    } = this.props;

    const data = aggregateMaxVersions(dataTable.toJS());
    const { lockedRows, deactivatedRows } = findLockedAndDeactivatedRules(dataTable.toJS());
    this.lockedRows = lockedRows;
    this.deactivatedRows = deactivatedRows;

    const columns = [
      {
        name: '_id',
        options: {
          display: false,
          filter: false,
          setCellProps: this.setCellProps
        }
      },
      {
        name: 'version',
        label: 'Max. Version',
        options: {
          filter: false,
          setCellProps: this.setCellProps
        }
      },
      {
        name: 'name',
        label: 'Name',
        options: {
          filter: false,
          setCellProps: this.setCellProps
        }
      },
      {
        name: 'servers',
        label: 'Servers',
        // label: 'Env.',
        options: {
          filterType: 'custom',
          filter: true,
          setCellProps: this.setCellProps,
          // hint: 'Taget Execution Server',
          customBodyRender: this.renderServersColumn,
          customFilterListOptions: {
            render: selected => selected.map(id => idsToLabels(allServers.toJS())[id])
          },
          filterOptions: filterOptions(allServers.toJS(), 'Servers') // import filter logic and feed it w/ config table data
        }
      },
      {
        name: 'tags',
        label: 'Tags',
        options: {
          filter: true,
          filterType: 'custom',
          customBodyRender: this.renderTagsColumn,
          customFilterListOptions: {
            render: selected => selected.map(id => idsToLabels(allTags.toJS())[id])
          },
          filterOptions: filterOptions(allTags.toJS(), 'Tags') // import filter logic and feed it w/ config table data
        }
      },
      {
        name: 'active', // Custom rendering status-toggle & delete actions in last column
        label: 'Active',
        options: {
          filter: true,
          customBodyRender: this.renderCRUDActionsColumn
        }
      }
    ];
    // console.log(this.props.rowsExpanded);
    const options = {
      //   responsive: 'stacked',
      rowsPerPageOptions: [10, 25, 50, 100],
      //   page: 1,
      //   onRowSelectionChange: this.onRowSelectionChange
      filter: true,
      search: true,
      // fixedHeader: true,
      // fixedSelectColumn: true,
      // searchOpen: true,
      download: false,
      filterType: 'dropdown',
      responsive: 'standard',
      expandableRows: true,
      // fixedHeader: true,
      expandableRowsHeader: false,
      expandableRowsOnClick: true,
      isRowExpandable: this.isRowExpandableLogic,
      selectableRows: 'multiple',
      sort: false,
      print: false,
      viewColumns: false,
      rowsExpanded: this.state.rowsExpanded, // {array} User provided expanded rows
      onFilterChange: () => this.setState({ rowsExpanded: [] }), // DEBUG: reset expanded rows upon filter (displayed data) change; it was messing expansion upon filtering
      renderExpandableRow: this.renderCollapseVersionsPanel,
      customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
        <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} />
      ),
      onRowExpansionChange: this.onRowExpansionChangeLogic,
      customToolbar: () => ( // {jsx} Expanding table toolbar w/ import rules and create new rule
        <CustomToolbar
          onClickImportRules={() => this.setState({ popUp: { status: true, type: 'drop files', text: '' } })}
          onClickCreateRule={() => this.setState({ popUp: { status: true, type: 'create new rule', text: '' } })}
        />
      )
      // onTableChange: (action, TableState) => {
      //   console.log('TABLE STATE CHANGED: ', action, TableState);
      //   if (action === 'rowExpansionChange') {
      //     let rowsExpanded;
      //     TableState.curExpandedRows.map(item=>)
      //   }
      // }
    };

    const components = {
      ExpandButton: (props) => {
        if (this.lockedRows.includes(props.dataIndex)) {
          return (
            <LockIcon style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '20px' }} />
          );
        }
        return <ExpandButton {...props} />;
      }
    };

    return (
      <div>
        <Notification close={() => closeNotif(branch)} message={messageNotif} severity={severityNotif} /> {/* TODO:NOTIF. TRIGGERS RE-RENDERING */}
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title="Rules Manager"
            data={data} // Top level data: ID, Version, Title, Servers, Tags ? is it an aggregation?
            columns={columns}
            options={options}
            components={components}
          />
        </MuiThemeProvider>
        {this.state.popUp.status ?
          <PopUp
            dialogType={this.state.popUp.type}
            dialogText={this.state.popUp.text}
            onClose={this.onPopUpClose}
            // allServers={allServers}
            // allTags={allTags}
            onConfirmDeleteRule={() => {
              this.onConfirmDeleteRule();
              this.setState({ popUp: { status: false } });
            }}
            onSubmitImportedRules={(targetServer, selectedTag, selectedFiles) => {
              // console.log('selectedFiles', selectedFiles);
              ImportRules(targetServer, selectedTag, selectedFiles); // Sending selected DSLR files for parsing
              this.setState({ popUp: { status: false } });
            }}
            onSubmitCreatedRule={(targetServer, selectedTag, ruleContent) => {
              // console.log(targetServer, ruleContent);
              ImportCreatedRule(targetServer, selectedTag, ruleContent); // Sending newly created rule for parsing
              this.setState({ popUp: { status: false } });
            }}
          /> : ''}
      </div>
    );
  }
}

RulesManagerParentTable.propTypes = {
  removeRow: PropTypes.func.isRequired,
  // updateExpandedRows: PropTypes.func.isRequired,
  updateRuleStatus: PropTypes.func.isRequired,
  dataTable: PropTypes.object.isRequired,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  // rowsExpanded: PropTypes.array.isRequired
  severityNotif: PropTypes.string.isRequired,
  allServers: PropTypes.array.isRequired,
  allTags: PropTypes.array.isRequired,
};

/**
 * Access to Incoming state (data)
 * @param {Object} state
 */
const mapStateToProps = state => {
  return {
    force: state, // force state from reducer
    dataTable: state.getIn([branch, 'dataTable']),
    messageNotif: state.getIn([branch, 'notifMsg']),
    severityNotif: state.getIn([branch, 'notifSeverity']),
    allServers: state.getIn(['ServersConfig', 'dataTable']), // injecting servers config for chips id-to-label conversion
    allTags: state.getIn(['TagsConfig', 'dataTable']), // injecting servers config for chips id-to-label conversion
    // rowsExpanded: state.getIn([branch, 'rowsExpanded'])
  };
};

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => ({
  removeRow: bindActionCreators(removeAction, dispatch),
  closeNotif: bindActionCreators(closeNotifAction, dispatch),
  // updateExpandedRows: bindActionCreators(updateExpandedRows, dispatch),
  updateRuleStatus: bindActionCreators(updateRuleStatus, dispatch), // connect to action
});

/**
 * Connecting state w/ props
 */
const RulesManagerParentTableMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(RulesManagerParentTable);

export default RulesManagerParentTableMapped;
