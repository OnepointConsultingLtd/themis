

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
// import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
// import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  cloneAction,
  // addAction
} from 'ba-actions/RulesTableActions';

import RulesManagerVersionRow from './RulesManagerVersionRow';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
  },
});

/**
 * Renders a rule's versions panel
 * @param {any} props
 */
function RulesManagerNestedVersionsPanel(props) {
  const classes = useRowStyles();
  const {
    ruleData,
    branch,
    cloneRow,
  } = props;

  const ruleID = props.ruleData.get('_id');
  const maxVersion = props.ruleData.get('versions').get(0).get('version');

  /** Clone top (max) version */
  const onCloneVersion = () => { cloneRow(ruleID, ruleData.get('versions').first(), branch); };

  return (
    <Table aria-label="collapsible table" size="small" style={{ margin: 0 }}>
      <TableHead>
        <TableRow className={classes.root} style={{ borderBottom: 'none' }}>
          <TableCell style={{ width: '0.001%' }} />
          <TableCell align="center" component="th" scope="row" style={{ width: '3%', minWidth: '80px' }}>Ver.</TableCell>
          <TableCell align="left" style={{ width: '2%', minWidth: '160px' }}>Submitted On</TableCell>
          <TableCell align="left" style={{ width: '15%', minWidth: '120px' }}>Submitted By</TableCell>
          <TableCell align="left" style={{ width: '10%' }}>Servers</TableCell>
          <TableCell align="right" style={{ width: '70%' }}>
            <Tooltip title="Add new version">
              <IconButton
                onClick={onCloneVersion}
                className={classes.button}
                aria-label="Add version"
              >
                <AddCircleOutlineIcon style={{ fontSize: '30px' }} />
              </IconButton>
            </Tooltip>
          </TableCell>
          {/* <TableCell align="left" style={{ width: '10%' }} /> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {ruleData.get('versions').map(versionData => {
          const key = ruleID + 'version' + versionData.get('version').toString();
          return (
            <RulesManagerVersionRow
              ruleId={ruleID}
              branch={branch}
              versionData={versionData}
              key={key}
              maxVersion={maxVersion}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

RulesManagerNestedVersionsPanel.propTypes = {
  ruleData: PropTypes.object.isRequired,
  branch: PropTypes.string.isRequired,
  cloneRow: PropTypes.func.isRequired,
};

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => ({
  cloneRow: bindActionCreators(cloneAction, dispatch),
});

/**
 * Connecting state w/ props
 */
const RulesManagerNestedVersionsPanelMapped = connect(
  null,
  mapDispatchToProps
)(RulesManagerNestedVersionsPanel);

export default RulesManagerNestedVersionsPanelMapped;
