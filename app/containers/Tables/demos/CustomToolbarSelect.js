/* eslint-disable react/sort-comp */
/* eslint-disable react/style-prop-object */
/* eslint-disable react/no-unknown-property */
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
  removeAction
} from 'ba-actions/RulesTableActions';
// import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import PopUp from './PopUp';
// import CustomSVG from './customSVG.js'; // custom created SVG's!!

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
    this.state = { popUp: false };
  }

  handleClickInverseSelection = () => {
    // eslint-disable-next-line no-shadow
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
    // collect all select rules absolute index withing the dataTable
    const selectedRulesIndicesArray = this.props.selectedRows.data.map(selectedRule => selectedRule.index);
    // fetch actual rules _ids based on above collection
    return selectedRulesIndicesArray.map(ruleIndex => this.props.dataTable.toJS()[ruleIndex]._id);
  }

  /** Bulk update of selected rules: deactivation */
  deactivateRules = () => {
    this.props.bulkDeactivateRules(this.fetchSelectedRulesIds(), branch);
  }

  /** Bulk update of selected rules: activation */
  activateRules = () => {
    this.props.bulkActivateRules(this.fetchSelectedRulesIds(), branch);
  }

  /** Bulk update of selected rules:  deletion */
  deleteRules = () => {
    this.props.bulkDeleteRules(this.fetchSelectedRulesIds(), branch);
  }

  /**
  * Action to perform when user clicks CANCEL in the popup
  */
  onPopUpClose = () => {
    this.setState({ popUp: false });
  };


  render() {
    const { classes } = this.props;

    return (
      <div className="custom-toolbar-select">
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
        <Tooltip title="Deactivate">
          <IconButton className={classes.iconButton} onClick={this.deactivateRules}>
            <Icon className={classes.icon} >pause</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Activate">
          <IconButton className={classes.iconButton} onClick={this.activateRules}>
            <Icon className={classes.icon} >play_arrow</Icon>
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
};

/**
 * Access to Incoming state (data)
 * @param {Object} state
 */
const mapStateToProps = state =>
  ({
    force: state, // force state from reducer
    dataTable: state.getIn([branch, 'dataTable']),
  });

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => ({
  removeRow: bindActionCreators(removeAction, dispatch),
  closeNotif: bindActionCreators(closeNotifAction, dispatch),
  bulkDeactivateRules: bindActionCreators(bulkDeactivate, dispatch),
  bulkActivateRules: bindActionCreators(bulkActivate, dispatch),
  bulkDeleteRules: bindActionCreators(bulkDelete, dispatch)
});

/**
 * Connecting state w/ props
 */
const CustomToolbarSelectMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomToolbarSelect);

export default withStyles(defaultToolbarSelectStyles, { name: 'CustomToolbarSelect' })(CustomToolbarSelectMapped);
