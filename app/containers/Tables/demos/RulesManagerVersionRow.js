/* eslint-disable no-unused-vars */
/* eslint-disable import/no-duplicates */
// eslint-disable-next-line spaced-comment
import React, { useState, useEffect } from 'react';
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
// import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/BorderColor';
// import ControlPointDuplicateIcon from '@material-ui/icons/ControlPointDuplicate'; // Decommissioned version cloning
// import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MultiSelectConfig from 'ba-components/Tables/tableParts/MultiSelectConfig';
// import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import css from 'ba-styles/Table.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  // cloneAction, // Decommissioned version cloning
  // updateAction, // Decommissioned
  editAction,
  discardAction,
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
    force,
    versionData,
    ruleId,
    maxVersion,
    // usedServers,
    // availableServers,
    allServers, // injected servers config table
    allTags, // injected tags config table
    branch,
    // removeRow, // moved to rule level
    // updateRow, // Decommissioned
    // cloneRow, // Decommissioned
    editRow,
    discardRow,
    saveRow,
  } = props;
  // Local state hook (content expansion)
  const [open, setOpen] = useState(false);
  const [selectedServers, setServers] = useState(versionData.get('servers').toJS());
  const [selectedTags, setTags] = useState(versionData.get('tags').toJS());
  const [content, setContent] = useState(versionData.get('content'));

  // Keep data flowing (w/out this, selectors won't be alive!)
  useEffect(() => {
    setTags(versionData.get('tags').toJS());
    setServers(versionData.get('servers').toJS()); // ---> these are the actions triggered by Observable changes
    setContent(versionData.get('content'));
  }, [versionData]); // ---> this acts as the Observable of the subscription

  const classes = useRowStyles();
  // let content = versionData.get('content');

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

  const handleOpen = () => {
    setOpen(!open);
  };
  // const onChangeContent = (liveContent) => {
  //   setContent(liveContent);
  // };

  // const onDropDownChange = (event) => updateRow(ruleId, event, versionData, branch); // Old update-version event
  const onDropDownChange = (selector) => (event) => {
    if (selector === 'servers') setServers(event.target.value);
    else setTags(event.target.value);
  };
  const eventEdit = () => {
    if (!open) setOpen(!open);
    editRow(ruleId, versionData, branch);
  };
  const eventDiscardChanges = () => {
    setServers(versionData.get('servers').toJS());
    setTags(versionData.get('tags').toJS());
    setContent(versionData.get('content'));
    discardRow(ruleId, versionData, branch);
  };
  const eventDone = () => {
    if (open) setOpen(!open);
    saveRow(ruleId, versionData.get('version'), selectedServers, selectedTags, content, branch);
  };

  // https://github.com/sotiriosalpha/rulesMS/issues/10:
  // const onForceNA = () => updateRow(ruleId, { target: { name: 'servers', value: ['NA'] } }, versionData, branch);

  // const onCloneVersion = () => cloneRow(ruleId, versionData, branch); // Decommissioned, moved in higher level

  // Available servers in rule level (server-selector: dynamic amongst versions) NOTE: this does not apply to 'tags'
  const allServersIds = allServers.map(server => server.get('_id')); // <----- SERVER's ID's LIST INJECTION

  // https://github.com/sotiriosalpha/rulesMS/issues/10:
  // const availableServersIds = OrderedSet(allServersIds).subtract(usedServers); // <---- Dynamic calculation of available servers

  // Tags ids
  const allTagsIds = allTags.map(tag => tag.get('_id')); // <----- SERVER's ID's LIST INJECTION, needed for MultiSelectServers.js reusability

  return (
    <React.Fragment>
      <TableRow className={classes.root} style={{ borderBottom: 'unset' }} key={ruleId + versionData.get('version')}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{versionData.get('version')}</TableCell>
        <TableCell align="left">{versionData.get('subOn')}</TableCell>
        <TableCell align="left">{versionData.get('subBy')}</TableCell>
        <TableCell align="left">
          <MultiSelectConfig
            updateRow={onDropDownChange('servers')}
            cellData={{
              name: 'servers', // field name, neccessary for redux UPDATE cell action
              value: selectedServers,
              id: '1',
            }}
            edited={versionData.get('edited')}
            key={`${ruleId}-${versionData.get('version')}-servers`}
            allOptions={allServers.toJS()} // needs conversion to plain array
            // activeOptions={availableServersIds.toJS()} // https://github.com/sotiriosalpha/rulesMS/issues/10 // this is dynamically aggregated fromall versions in the panel
            activeOptions={allServersIds.toJS()}
            multiple
          />
        </TableCell>
        <TableCell align="left">
          {/* {versionData.get('tags').map((val, key) => <Chip label={val} key={Math.random(key)} />)} OLD CHIPS ARRANGEMENT */}
          <MultiSelectConfig
            updateRow={onDropDownChange('tags')} // Check where this is wired up in redux actions side
            cellData={{
              name: 'tags', // field name, neccessary for redux UPDATE cell action
              value: selectedTags,
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
              // ***NEVER DISABLED as of #10 https://github.com/sotiriosalpha/rulesMS/issues/10 **** disabled={versionData.toJS().version !== maxVersion && versionData.toJS().servers[0] !== 'NA'}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save changes">
            <IconButton
              onClick={eventDone}
              style={{ color: '#4caf50' }}
              className={classNames((!versionData.get('edited') ? css.hideAction : ''), classes.button)}
              aria-label="Done"
            >
              <DoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Discard changes">
            <IconButton
              onClick={eventDiscardChanges}
              color="secondary"
              className={classNames((!versionData.get('edited') ? css.hideAction : ''), classes.button)}
              aria-label="Discard"
            >
              <Clear />
            </IconButton>
          </Tooltip>
          {/* <IconButton
            onClick={onCloneVersion}    // Decommissioned
            className={classes.button}
            aria-label="Clone version"
          >
            <ControlPointDuplicateIcon />
          </IconButton> */}
          {/* <IconButton
            onClick={onForceNA}
            className={classes.button}
            aria-label="Deactivate"
          >
            <PauseCircleOutlineIcon />
          </IconButton> */}
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
              onChange={setContent}
              fontSize={14}
              showGutter
              highlightActiveLine
              value={content}
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
  force: PropTypes.object.isRequired,
  ruleId: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  versionData: PropTypes.object.isRequired,
  maxVersion: PropTypes.number.isRequired,
  // usedServers: PropTypes.array.isRequired,
  // removeRow: PropTypes.func.isRequired, // moved to rule level
  // updateRow: PropTypes.func.isRequired, // decommissioned
  // cloneRow: PropTypes.func.isRequired, // decommissioned
  editRow: PropTypes.func.isRequired,
  discardRow: PropTypes.func.isRequired,
  saveRow: PropTypes.func.isRequired,
  allServers: PropTypes.array.isRequired,
  allTags: PropTypes.array.isRequired,
};


/**
 * Incoming state (rule data and configuration tables)
 * @param {Object} state
 */
const mapStateToProps = (state, ownProps) => ({
  force: state, // force state from reducer
  // usedServers: state.getIn([ownProps.branch, 'dataTable']) // tapping into versions data from current rule state
  //   .find(rule => rule.get('_id') === ownProps.ruleId) // --------->
  //   .get('versions') // -------------------------------------------> Dynamic aggregation of available servers
  //   .map(version => version.get('servers')) // -------------------->
  //   .flatten(), // immu-flattening array of arrays (the field 'servers' is an array, dont forget)
  allServers: state.getIn(['ServersConfig', 'dataTable']), // -> injecting servers config here in this component
  allTags: state.getIn(['TagsConfig', 'dataTable']), // -------> injecting tags config here in this component
});

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = (dispatch) => ({
  // removeRow: bindActionCreators(removeAction, dispatch), // moved to rule level
  // updateRow: bindActionCreators(updateAction, dispatch), // decommissioned when making SAVE as priority
  // cloneRow: bindActionCreators(cloneAction, dispatch), // decommissioned
  editRow: bindActionCreators(editAction, dispatch),
  discardRow: bindActionCreators(discardAction, dispatch),
  saveRow: bindActionCreators(saveAction, dispatch)
});

/**
 * Connecting state w/ props
 */
const RulesManagerVersionRowMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(RulesManagerVersionRow);

export default RulesManagerVersionRowMapped;
