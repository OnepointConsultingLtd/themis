/* eslint-disable react/sort-comp */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable object-curly-newline */
import React from 'react';
// import axios from 'axios';
import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
// import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import Chip from '@material-ui/core/Chip';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Notification from 'ba-components/Notification/Notification';
import AceEditor from 'react-ace'; // https://www.npmjs.com/package/react-ace   https://securingsincity.github.io/react-ace/
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import timestamp from 'time-stamp';
// import { PapperBlock } from 'ba-components';
import { closeNotifAction, showNotification } from 'ba-actions/RulesTableActions';
import { aggregateAllActiveDeployedVersions, aggregateServerReturnContent } from './demos/data';
import PopUp from './demos/PopUp';
import { idsToLabels, idsToUrls, idsToArray } from './demos/idsToProperties';
import { renderServersChips, renderTagsChips } from './demos/renderChipLabelsFromIds';
// import filterOptions from './demos/filterLogic';

// Reducer Branch
const branch = 'RulesManagerParentTable';

/*
  It uses npm mui-datatables. It's easy to use, you just describe columns and data collection.
  Checkout full documentation here :
  https://github.com/gregnb/mui-datatables/blob/master/README.md
*/
class DSLGeneratorParentTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popUpStatus: false,
      popUpType: '',
      popUpText: '',
      // selectedServerId: '',
      // isServerSelected: false,
      // isDeployMenuOpen: false,
      anchorEl: null
    };
  }
/**
 * Renders a single rule's multi-versions panel
 * @param {Object} rowData: A single row's data containing Rule ID, and maxVersion's details: Title, Server's etc
 * We need Rule's ID for quering rule's full details
 */
renderCollapseVersionsPanel = (rowData) => {
  // const [ruleId, version, title, **subOn, **subBy, servers, tags, **edited, content] = rowData;
  // console.log('metadata:', rowData);
  const ruleId = rowData[0];
  const version = rowData[1];
  const content = rowData[5];
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

  return (
    // <Grow in style={{ transformOrigin: '50% 0 0' }} {...{ timeout: 1000 }}>
    <TableRow>
      <style>
        {inEffect}
      </style>
      <TableCell colSpan={colSpan} style={inlineStyle} id={'expandedRow' + ruleId} >
        <AceEditor
          mode="java"
          theme="github"
          name={('code' + ruleId + 'v' + version).toString()} // need to provide a unique id for the code-box
          width="100%"
          // onLoad={this.onLoad}
          fontSize={14}
          showGutter
          highlightActiveLine
          value={content}
          readOnly
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </TableCell>
    </TableRow>
    // </Grow>
  );
}

getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableFilter: {
      root: {
        width: '500px' // Filter modal was too narrow. needed some space
      }
    },
    MUIDataTableFilterList: { // https://github.com/gregnb/mui-datatables/issues/181
      chip: {
        display: 'none'
      }
    }
  }
})

/**
 * Action to perform when user clicks CANCEL in the popup
 */
onPopUpClose = () => {
  this.setState({ popUpStatus: false });
  // console.log(this.state);
};

/**
 * Action to perform when user clicks DEPLOY in the popup
 * HTTP POST TEXT TO SERVER
 */
onSubmitDeployRules = async () => {
  console.log(`Ready to deploy to ${idsToUrls(this.props.allServers.toJS())[this.state.selectedServerId]} CONTENT: ${this.state.popUpText}`);
  const serverURL = idsToUrls(this.props.allServers.toJS())[this.state.selectedServerId];
  const deploymentResponse = await fetch(serverURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      Accept: 'text/html'
    },
    body: this.state.popUpText
  });
  this.setState({ popUpStatus: false });
  console.log(deploymentResponse);
  // this.props.showNotif(deploymentResponse, 'success', branch);
  if (deploymentResponse.status !== 200) { // Error handling
    this.props.showNotif( // dispatch notification only
      'DSLR could not be generated',
      'error',
      branch // dont forget to always dispatch branch, otherwise the store middleware cannot work
    );
  } else {
    this.props.showNotif( // dispatch notification only
      'DSLR file has been deployed successfully',
      'success',
      branch // dont forget to always dispatch branch, otherwise the store middleware cannot work
    );
  }
}

/** Dowload file in client side */
downloadDSLR = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Action to perform when user clicks DOWNLOAD in the popup
 * Download file in client side
 */
onSubmitDownloadRules = () => {
  const serverLabel = idsToLabels(this.props.allServers.toJS())[this.state.selectedServerId];
  this.downloadDSLR(`${timestamp.utc('YYYYMMDDHHmm')}_${serverLabel}.dslr`, this.state.popUpText);
}

handleClick = (event) => {
  this.setState({ anchorEl: event.currentTarget });
};

handleClose = () => {
  this.setState({ anchorEl: null });
}

handleDeploymentServerClick = (optionId, versionsData) => {
  // console.log('optionId', optionId);
  this.handleClose();
  const serverVersions = aggregateServerReturnContent(versionsData, optionId);
  this.setState({ popUpText: serverVersions || 'No rules for selected target server' });
  this.setState({ popUpStatus: true, popUpType: serverVersions ? 'rules list' : 'error' });
}

render() {
  const {
    dataTable,
    closeNotif,
    severityNotif,
    messageNotif,
    allServers,
    allTags,
    tags,
    filterLogic
  } = this.props;
  // console.log('>>>> PREFILTERED TAGS: ', tags);
  // console.log('This is our data! : ', dataTable);
  const data = aggregateAllActiveDeployedVersions(dataTable.toJS(), tags, filterLogic, idsToArray(allTags.toJS()));
  // console.log('This is our aggregated data! : ', data);
  // const customBodyRender = (value) =>
  //   value.map((val) => <Chip label={val} key={(+new Date() + Math.floor(Math.random() * 999999)).toString(36)} />);
  const columns = [
    {
      name: '_id',
      options: {
        filter: false,
        display: false,
      }
    },
    {
      name: 'version',
      label: 'Version',
      options: {
        filter: false
      }
    },
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: false
      }
    },
    {
      name: 'servers',
      label: 'Servers',
      // label: 'Env.',
      options: {
        filter: false,
        // filterType: 'custom',
        // filterList: [this.state.selectedServerId],
        // customFilterListOptions: {
        //   render: selected => idsToLabels(allServers.toJS())[selected]
        // },
        // filterOptions: filterOptions(allServers.toJS(), 'Servers', false), // import filter logic and feed it w/ config table data
        customBodyRender: (value, tableMeta) => renderServersChips(allServers, value, tableMeta, []) // render as chips
      }
    },
    {
      name: 'tags',
      label: 'Tags',
      options: {
        filter: false,
        // filterType: 'custom',
        // filterList: tags, // *** pre-filtering ***
        // customFilterListOptions: {
        //   // render: selected => idsToLabels(allTags.toJS())[selected]
        //   render: () => ''
        // },
        // filterOptions: filterOptions(allTags.toJS(), 'Tags', true),
        customBodyRender: (value, tableMeta) => renderTagsChips(allTags, value, tableMeta, []) // render as chips
      }
    },
    {
      name: 'content',
      options: {
        filter: false,
        display: false
      }
    }
  ];
  const options = {
    filter: false,
    filterType: 'dropdown',
    responsive: 'standard',
    rowsPerPage: 15,
    expandableRows: true,
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
    selectableRows: 'none',
    search: false,
    sort: false,
    print: false,
    viewColumns: false,
    download: false,
    // onTableChange: (action, tableState) => {
    //   const { filterList, displayData } = tableState;
    //   console.log(action, filterList, displayData, tableState);
    //   // if (filterList[3].length > 0) { // if user has filtered a server
    //   //   // this.setState({ selectedServerId: filterList[3], isServerSelected: true });
    //   // this.setState({ popUpText: displayData.map(x => x.data[5]).join('\n\n') });
    //   // } else this.setState({ selectedServerId: '', isServerSelected: false });
    // },
    // onFilterChange: (changedColumn, filterList, type, changedColumnIndex, displayedData) => {
    //   console.log('>>>>>  FILTER CHANGE, DETAILS: ', changedColumn, filterList, type);
    //   if (filterList[3].length > 0) { // if user has filtered a server
    //     this.setState({ selectedServerId: filterList[3], isServerSelected: true });
    //     this.setState({ popUpText: displayedData.map(x => x.data[5]).join('\n\n') });
    //   } else this.setState({ selectedServerId: '', isServerSelected: false });
    // },
    renderExpandableRow: this.renderCollapseVersionsPanel,
    customToolbar: () => (
      <div>
        <Button
          variant="contained"
          color="secondary"
          aria-controls="simple-menu"
          aria-haspopup="true"
          startIcon={<CloudUploadIcon />}
          onClick={this.handleClick}
          style={{ marginTop: '20px' }}
        >
            DEPLOY
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          {allServers.toJS().map((option, index) =>
            <MenuItem onClick={() => this.handleDeploymentServerClick(option._id, data)} key={index.toString()}>{option.label}</MenuItem>)}
        </Menu>
      </div>
    )
  };

  return (
    <div>
      <Notification close={() => closeNotif(branch)} message={messageNotif} severity={severityNotif} /> {/* TODO:NOTIF. TRIGGERS RE-RENDERING */}
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MUIDataTable
          title="DSLR Generator"
          data={data} // Top level data: ID, Version, Title, Servers, Tags ? is it an aggregation?
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
      {this.state.popUpStatus ?
        <PopUp
          dialogType={this.state.popUpType} // 'error' || 'rules text'
          dialogText={this.state.popUpText} // error message || rules content pay-load
          onClose={this.onPopUpClose}
          onSubmitDownloadRules={this.onSubmitDownloadRules}
          onSubmitDeployRules={this.onSubmitDeployRules}
        /> : ''}
    </div>
  );
}
}

DSLGeneratorParentTable.propTypes = {
  dataTable: PropTypes.object.isRequired,
  closeNotif: PropTypes.func.isRequired,
  showNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  allServers: PropTypes.array.isRequired,
  allTags: PropTypes.array.isRequired,
  severityNotif: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  filterLogic: PropTypes.string.isRequired,
};

/**
 * Access to Incoming state (data)
 * @param {Object} state
 */
const mapStateToProps = state => ({
  force: state, // force state from reducer
  dataTable: state.getIn([branch, 'dataTable']),
  severityNotif: state.getIn([branch, 'notifSeverity']),
  messageNotif: state.getIn([branch, 'notifMsg']),
  allServers: state.getIn(['ServersConfig', 'dataTable']), // injecting servers config for chips id-to-label conversion
  allTags: state.getIn(['TagsConfig', 'dataTable']), // injecting servers config for chips id-to-label conversion
});

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => ({
  closeNotif: bindActionCreators(closeNotifAction, dispatch),
  showNotif: bindActionCreators(showNotification, dispatch),
});

/**
 * Connecting state w/ props
 */
const DSLGeneratorParentTableMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(DSLGeneratorParentTable);

export default DSLGeneratorParentTableMapped;
