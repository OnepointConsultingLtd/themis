/* eslint-disable react/style-prop-object */
/* eslint-disable react/no-unknown-property */
import React from 'react';
import { PropTypes } from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import CustomSVG from './customSVG.js';

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

class CustomToolbarSelect extends React.Component {
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

  handleClickBlockSelected = () => {
    console.log(`block users with dataIndexes: ${this.props.selectedRows.data.map(row => row.dataIndex)}`);
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
          <IconButton className={classes.iconButton} onClick={this.handleClickBlockSelected}>
            <Icon className={classes.icon} >pause</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Activate">
          <IconButton className={classes.iconButton} onClick={this.handleClickBlockSelected}>
            <Icon className={classes.icon} >play_arrow</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton className={classes.iconButton} onClick={this.handleClickBlockSelected}>
            <Icon className={classes.icon} >delete</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Move up to PROD">
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
        </Tooltip>
      </div>
    );
  }
}


CustomToolbarSelect.propTypes = {
  selectedRows: PropTypes.object.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  displayData: PropTypes.array.isRequired
};

export default withStyles(defaultToolbarSelectStyles, { name: 'CustomToolbarSelect' })(CustomToolbarSelect);
