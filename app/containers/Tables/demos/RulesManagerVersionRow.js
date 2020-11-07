/* eslint-disable no-unused-vars */
/* eslint-disable import/no-duplicates */
// eslint-disable-next-line spaced-comment
import React/*, { useEffect } */ from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// import { createBrowserHistory } from 'history';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import Collapse from '@material-ui/core/Collapse';
import AceEditor from 'react-ace'; // https://www.npmjs.com/package/react-ace   https://securingsincity.github.io/react-ace/
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/BorderColor';
// import ControlPointDuplicateIcon from '@material-ui/icons/ControlPointDuplicate'; // Decommissioned version cloning
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MultiSelectConfig from 'ba-components/Tables/tableParts/MultiSelectConfig';
// import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import css from 'ba-styles/Table.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  // cloneAction, // Decommissioned version cloning
  updateAction,
  editAction,
  saveAction
} from 'ba-actions/RulesTableActions';
// eslint-disable-next-line no-unused-vars
import { /* fromJS, List, */ OrderedSet /* Map */ } from 'immutable';
import flatten from 'immutable';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
  },
});

/**
 * Renders a single version's row (expandable to show content)
 * @param {any} props
 */
function RulesManagerVersionRow(props) {
  const {
    versionData,
    ruleId,
    maxVersion,
    usedServers,
    // availableServers,
    allServers, // injected servers config table
    allTags, // injected tags config table
    branch,
    // removeRow, // moved to rule level
    updateRow,
    // cloneRow, // Decommissioned
    editRow,
    finishEditRow,
  } = props;

  // Local state hook (content expansion)
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  let content = versionData.get('content');

  // TODO : BLock user navigation upon error in form

  // useEffect(() => {
  //   const history = createBrowserHistory();
  //   // Listen for changes to the current location.
  //   const unlisten = history.listen(({ location, action }) => {
  //     console.log(action, location.pathname, location.state);
  //   });
  //   // returned function will be called on component unmount
  //   return () => {
  //     unlisten();
  //   };
  // }, []);

  const eventEdit = () => {
    if (!open) setOpen(!open);
    editRow(ruleId, versionData, branch);
  };
  const eventDone = () => {
    if (open) setOpen(!open);
    finishEditRow(ruleId, versionData, branch, content);
  };
  const onChange = (liveContent) => {
    content = liveContent;
  };
  const onDropDownChange = (event) => updateRow(ruleId, event, versionData, branch);
  const onForceNA = () => updateRow(ruleId, { target: { name: 'servers', value: ['NA'] } }, versionData, branch);
  // const onCloneVersion = () => cloneRow(ruleId, versionData, branch); // Decommissioned

  // Available servers in rule level (server-selector: dynamic amongst versions) NOTE: this does not apply to 'tags'
  const allServersIds = allServers.map(server => server.get('_id')); // <----- SERVER's ID's LIST INJECTION
  const availableServersIds = OrderedSet(allServersIds).subtract(usedServers); // <---- Dynamic calculation of available servers

  // Tags ids
  const allTagsIds = allTags.map(tag => tag.get('_id')); // <----- SERVER's ID's LIST INJECTION, needed for MultiSelectServers.js reusability

  return (
    <React.Fragment>
      <TableRow className={classes.root} style={{ borderBottom: 'unset' }} key={ruleId + versionData.get('version')}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{versionData.get('version')}</TableCell>
        <TableCell align="left">{versionData.get('subOn')}</TableCell>
        <TableCell align="left">{versionData.get('subBy')}</TableCell>
        <TableCell align="left">
          <MultiSelectConfig
            updateRow={onDropDownChange}
            cellData={{
              name: 'servers', // field name, neccessary for redux UPDATE cell action
              value: versionData.toJS().servers,
              id: '1',
            }}
            edited={versionData.get('edited')}
            key={`${ruleId}-${versionData.get('version')}-servers`}
            allOptions={allServers.toJS()} // needs conversion to plain array
            // options={['PROD', 'PREP', 'TEST', 'DEV']} // TODO: need be configurable
            activeOptions={availableServersIds.toJS()} // this is dynamically aggregated fromall versions in the panel
            multiple
          />
        </TableCell>
        <TableCell align="left">
          {/* {versionData.get('tags').map((val, key) => <Chip label={val} key={Math.random(key)} />)} OLD CHIPS ARRANGEMENT */}
          <MultiSelectConfig
            updateRow={onDropDownChange} // Check where this is wired up in redux actions side
            cellData={{
              name: 'tags', // field name, neccessary for redux UPDATE cell action
              value: versionData.toJS().tags,
              id: '1',
            }}
            edited={versionData.get('edited')}
            key={`${ruleId}-${versionData.get('version')}-tags`}
            allOptions={allTags.toJS()} // needs conversion to plain array
            activeOptions={allTagsIds.toJS()} // all configed tags from redux, nothing aggregated here
            multiple
          />
        </TableCell>
        {/* <TableCell align="left">{versionData.get('edited') ? 'TRUE' : 'NO'}</TableCell> */}
        <TableCell align="right" >
          <Tooltip title="Edit rule">
            <IconButton
              onClick={eventEdit}
              className={classNames((versionData.get('edited') ? css.hideAction : ''), classes.button)}
              aria-label="Edit"
              // disabled={versionData.toJS().servers.includes('PROD') || versionData.toJS().servers.includes('PREP')}
              disabled={versionData.toJS().version !== maxVersion && versionData.toJS().servers[0] !== 'NA'}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={eventDone}
            color="secondary"
            className={classNames((!versionData.get('edited') ? css.hideAction : ''), classes.button)}
            aria-label="Done"
          >
            <DoneIcon />
          </IconButton>
          {/* <IconButton
            onClick={onCloneVersion}    // Decommissioned
            className={classes.button}
            aria-label="Clone version"
          >
            <ControlPointDuplicateIcon />
          </IconButton> */}
          <IconButton
            onClick={onForceNA}
            className={classes.button}
            aria-label="Deactivate"
          >
            <PauseCircleOutlineIcon />
          </IconButton>
          {/* <IconButton
            onClick={eventDel}
            className={classes.button}
            aria-label="Delete"
          >
            <DeleteIcon />
          </IconButton> */}
        </TableCell>
      </TableRow>
      <TableRow className={classes.root} style={{ borderBottom: 'unset' }} >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <AceEditor
              mode="java"
              theme="github"
              name={('code' + ruleId + 'v' + versionData.get('version')).toString()} // need to provide a unique id for the code-box
              width="100%"
              // onLoad={this.onLoad}
              onChange={onChange}
              fontSize={14}
              showGutter
              highlightActiveLine
              value={versionData.get('content')}
              readOnly={!versionData.get('edited')} // this is true in old unused rules versions and false in the rules versions that are active in any server
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

RulesManagerVersionRow.propTypes = {
  ruleId: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  versionData: PropTypes.object.isRequired,
  maxVersion: PropTypes.number.isRequired,
  usedServers: PropTypes.array.isRequired,
  // removeRow: PropTypes.func.isRequired, // moved to rule level
  updateRow: PropTypes.func.isRequired,
  // cloneRow: PropTypes.func.isRequired, // decommissioned
  editRow: PropTypes.func.isRequired,
  finishEditRow: PropTypes.func.isRequired,
  allServers: PropTypes.array.isRequired,
  allTags: PropTypes.array.isRequired,
};


/**
 * Incoming state (rule data and configuration tables)
 * @param {Object} state
 */
const mapStateToProps = (state, ownProps) => ({
  force: state, // force state from reducer
  usedServers: state.getIn([ownProps.branch, 'dataTable']) // tapping into versions data from current rule state
    .find(rule => rule.get('_id') === ownProps.ruleId) // --------->
    .get('versions') // -------------------------------------------> Dynamic aggregation of available servers
    .map(version => version.get('servers')) // -------------------->
    .flatten(), // immu-flattening array of arrays (the field 'servers' is an array, dont forget)
  allServers: state.getIn(['ServersConfig', 'dataTable']), // -> injecting servers config here in this component
  allTags: state.getIn(['TagsConfig', 'dataTable']), // -------> injecting tags config here in this component
});

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = (dispatch) => ({
  // removeRow: bindActionCreators(removeAction, dispatch), // moved to rule level
  updateRow: bindActionCreators(updateAction, dispatch),
  // cloneRow: bindActionCreators(cloneAction, dispatch), // decommissioned
  editRow: bindActionCreators(editAction, dispatch),
  finishEditRow: bindActionCreators(saveAction, dispatch)
});

/**
 * Connecting state w/ props
 */
const RulesManagerVersionRowMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(RulesManagerVersionRow);

export default RulesManagerVersionRowMapped;
