


import React from 'react';
import { PropTypes } from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  closeNotifAction,
  // updateExpandedRows,
  bulkDeactivate,
  bulkActivate,
  bulkDelete,
  bulkUpdateTags
} from 'ba-actions/RulesTableActions';
// import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import PopUp from './PopUp';
// import CustomSVG from './customSVG.js'; // custom created SVG's!!
import Autocomplete from './autocomplete';

// Reducer Branch
const branch = 'RulesManagerParentTable';

const defaultToolbarSelectStyles = {
  iconButton: {
    marginRight: '24px',
    top: '50%',
    display: 'inline-block',
    position: 'relative'
  },
  icon: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  inverseIcon: {
    transform: 'rotate(90deg)',
  },
  svgRect: {
    fill: 'rgba(0, 0, 0, 0.54)',
    strokeWidth: 3,
    stroke: 'rgba(0,0,0,0)'
  },
  svgText: {
    fontSize: '12px'
  },
  svgScale: {
    transform: 'scale(1)'
  }
};

/** The custom Selection Toolbar for the Parent Rules Management Table  */
class CustomToolbarSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popUp: false,
      tagsValue: []
    };
  }

  handleClickInverseSelection = () => {

    const nextSelectedRows = this.props.displayData.reduce((nextSelectedRows, _, index) => {
      if (!this.props.selectedRows.data.find(selectedRow => selectedRow.index === index)) {
        nextSelectedRows.push(index);
      }

      return nextSelectedRows;
    }, []);

    this.props.setSelectedRows(nextSelectedRows);
  };

  handleClickDeselectAll = () => {
    this.props.setSelectedRows([]);
  };

  /** returns the selected rules' Id's as an array  */
  fetchSelectedRulesIds = () => {
    // collect all select rules absolute index within the dataTable (dataIndex)
    const selectedRulesIndicesArray = this.props.selectedRows.data.map(selectedRule => selectedRule.dataIndex);
    // fetch actual rules _ids based on above collection
    return selectedRulesIndicesArray.map(ruleIndex => this.props.dataTable.toJS()[ruleIndex]._id);
  }

  /** Bulk update of selected rules: deactivation */
  deactivateRules = () => {
    this.props.bulkDeactivateRules(this.fetchSelectedRulesIds(), branch);
  }

  /** Bulk update of selected rules: activation */
  activateRules = () => {
    // const selectedRows = this.props.selectedRows.data.map(row => row.index);
    this.props.bulkActivateRules(this.fetchSelectedRulesIds(), branch);
    // console.log('Selected Rows: ', this.props.selectedRows);
    // this.props.setSelectedRows(selectedRows);
  }

  /** Bulk update of selected rules:  deletion */
  deleteRules = () => {
    this.props.bulkDeleteRules(this.fetchSelectedRulesIds(), branch);
    this.props.setSelectedRows([]); // dont forget to empty the selected
  }

  /** Bulk update the tags of the selected rules */
  updateTags = (e, newValue) => {
    this.setState({ tagsValue: newValue });
    this.props.bulkUpdateRulesTags(this.fetchSelectedRulesIds(), newValue, branch);
  }

  /**
  * Action to perform when user clicks CANCEL in the popup
  */
  onPopUpClose = () => {
    this.setState({ popUp: false });
  };


  render() {
    const { classes, allTags } = this.props;

    return (
      <div style={{ width: '583px', display: 'flex', flexWrap: 'no-wrap' }}>
        <Tooltip title="Deselect ALL">
          <IconButton className={classes.iconButton} onClick={this.handleClickDeselectAll}>
            <IndeterminateCheckBoxIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Inverse selection">
          <IconButton className={classes.iconButton} onClick={this.handleClickInverseSelection}>
            <Icon className={classes.icon} >exposure</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Select tags">
          <div style={{ minWidth: '200px', marginRight: '24px', marginTop: '5px' }}>
            <Autocomplete
              options={allTags.toJS()}
              value={this.state.tagsValue} // value is the array of labels
              onChange={this.updateTags}
              noUnderline={false}
              placeholder="Tags"
            />
          </div>
        </Tooltip>
        <Tooltip title="Deactivate">
          <IconButton className={classes.iconButton} onClick={this.deactivateRules}>
            <ToggleOffIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Activate">
          <IconButton className={classes.iconButton} onClick={this.activateRules}>
            <ToggleOnIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton className={classes.iconButton} onClick={() => this.setState({ popUp: true })}>
            <Icon className={classes.icon} >delete</Icon>
          </IconButton>
        </Tooltip>
        {this.state.popUp ?
          <PopUp
            dialogType="confirm delete"
            dialogText=""
            onClose={this.onPopUpClose}
            onConfirmDeleteRule={() => {
              this.deleteRules();
              this.setState({ popUp: false });
            }}
          /> : ''}
        {/* <Tooltip title="Move up to PROD">
          <IconButton>
            <CustomSVG text="PROD" color="warn" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Move up to PREPROD">
          <IconButton>
            <CustomSVG text="PRE"color="normal" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Move up to TEST">
          <IconButton>
            <CustomSVG text="TEST"color="normal" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Keep only in DEV">
          <IconButton>
            <CustomSVG text="DEV"color="success" />
          </IconButton>
        </Tooltip> */}
      </div>
    );
  }
}


CustomToolbarSelect.propTypes = {
  selectedRows: PropTypes.object.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  displayData: PropTypes.array.isRequired,
  dataTable: PropTypes.array.isRequired,
  bulkDeactivateRules: PropTypes.func.isRequired,
  bulkActivateRules: PropTypes.func.isRequired,
  bulkDeleteRules: PropTypes.func.isRequired,
  bulkUpdateRulesTags: PropTypes.func.isRequired,
  allTags: PropTypes.array.isRequired,
};

/**
 * Access to Incoming state (data)
 * @param {Object} state
 */
const mapStateToProps = state =>
  ({
    force: state, // force state from reducer
    dataTable: state.getIn([branch, 'dataTable']),
    allTags: state.getIn(['TagsConfig', 'dataTable']), // injecting servers config for chips id-to-label conversion
  });

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => ({
  closeNotif: bindActionCreators(closeNotifAction, dispatch),
  bulkDeactivateRules: bindActionCreators(bulkDeactivate, dispatch),
  bulkActivateRules: bindActionCreators(bulkActivate, dispatch),
  bulkDeleteRules: bindActionCreators(bulkDelete, dispatch),
  bulkUpdateRulesTags: bindActionCreators(bulkUpdateTags, dispatch)
});

/**
 * Connecting state w/ props
 */
const CustomToolbarSelectMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomToolbarSelect);

export default withStyles(defaultToolbarSelectStyles, { name: 'CustomToolbarSelect' })(CustomToolbarSelectMapped);
