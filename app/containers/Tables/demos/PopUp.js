import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import MultiSelectConfig from 'ba-components/Tables/tableParts/MultiSelectConfig';
import { makeStyles } from '@material-ui/core/styles';
// import Divider from '@material-ui/core/Divider';
// import InputLabel from '@material-ui/core/InputLabel';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import css from 'ba-styles/Table.scss';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
// https://github.com/ajaxorg/ace/wiki/Configuring-Ace
// https://www.npmjs.com/package/react-ace
// https://securingsincity.github.io/react-ace/
import Dropzone from 'react-dropzone';
// https://react-dropzone.js.org/
import { connect } from 'react-redux';
import './style.css';
// import serversTagsSelect from './serversTagsSelect';

// function Selectors() {
//   const [selectedServer, setSelectedServer] = useState(['NA']);
//   const [selectedTag, setSelectedTag] = useState(['NA']);

//   const handleTargetServer = event => {
//     let { value } = event.target;

//     // necessary selection validations ('NA' shouldn't be selectable but should show when nothing is selected)
//     if (value.length === 0) value = ['NA'];
//     else
//     if (value.includes('NA')) {
//       value.splice(value.indexOf('NA'), 1);
//     }
//     setSelectedServer(value);
//   };

//   const handleSelectedTag = event => {
//     let { value } = event.target;

//     // necessary selection validations ('NA' shouldn't be selectable but should show when nothing is selected)
//     if (value.length === 0) value = ['NA'];
//     else
//     if (value.includes('NA')) {
//       value.splice(value.indexOf('NA'), 1);
//     }
//     setSelectedTag(value);
//   };

//   return (
//     <Grid container spacing={6}>
//       <Grid item xs={4}>
//         <Typography gutterBottom variant="body1" style={{ minWidth: '150px' }}>
//               Target Server
//         </Typography>
//         {/* <InputLabel id="demo-simple-select-label">Select Target Server:</InputLabel> */}
//         <Select
//           style={{ minWidth: '150px' }}
//           name="new-rule-servers"
//           id="new-rule-servers-id4"
//           className={css.crudInput}
//           value={selectedServer}
//           onChange={handleTargetServer}
//           displayEmpty
//           margin="none"
//           multiple
//         >
//           <MenuItem value="NA" disabled>NA</MenuItem>
//           {allServers.map((serverOption) =>
//             (<MenuItem value={serverOption.get('_id')} key={`server-${serverOption.get('_id')}`}>{serverOption.get('label')}</MenuItem>)
//           )}
//         </Select>
//       </Grid>
//       <Grid item xs={4}>
//         <Typography gutterBottom variant="body1" style={{ minWidth: '150px' }}>
//               Tag(s)
//         </Typography>
//         <Select
//           style={{ minWidth: '150px' }}
//           name="new-rule-tags"
//           id="new-rule-tags-id4"
//           className={css.crudInput}
//           value={selectedTag}
//           onChange={handleSelectedTag}
//           displayEmpty
//           margin="none"
//           multiple
//         >
//           <MenuItem value="NA" disabled>NA</MenuItem>
//           {allTags.map((tagOption) =>
//             (<MenuItem value={tagOption.get('_id')} key={`tag-${tagOption.get('_id')}`}>{tagOption.get('label')}</MenuItem>)
//           )}
//         </Select>
//       </Grid>
//     </Grid>
//   );
// }

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
  },
});

/**
 * Renders an overlay dialog which either contains a user-prompt message or the full list of the selected rules
 * @param {string} dialogType: 'error' | 'rules list' | 'drop files'
 * @param {string} dialogText: <error message | rules full text | ?path? >
 * @param {callback function} onClose: callback for closing the dialog
 * @param {callback function} onSubmit: callback for submit button in dialog
 */
function PopUp({
  dialogType, dialogText, onClose, onConfirmDeleteRule,
  onSubmitImportedRules, onSubmitCreatedRule, onSubmitDownloadRules,
  onSubmitDeployRules, allServers, allTags
}) {
  const classes = useRowStyles();
  const [selectedFiles, setSelectedFiles] = useState(); // DEBUGGED: needed empty init state and not ([])
  const [ruleCodeContent, setRuleCodeContent] = useState();
  const [selectedServer, setSelectedServer] = useState({ target: { value: ['NA'] } });
  const [selectedTag, setSelectedTag] = useState({ target: { value: ['NA'] } });

  const handleFileDrops = (droppedFiles) => {
    setSelectedFiles(droppedFiles);
  };

  const handleRuleCodeChange = (liveContent) => {
    setRuleCodeContent(liveContent);
  };

  const renderError = () =>
    (
      <Dialog
        open
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Warning</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description1"
            tabIndex={-1}
          >
            <div>{dialogText}</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
              Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );

  const renderDeleteRuleConfirmation = () =>
    (
      <Dialog
        open
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Confirmation</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description1"
            tabIndex={-1}
          >
            <div>Are you sure you want to delete rule(s)?</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
              Cancel
          </Button>
          <Button onClick={onConfirmDeleteRule} color="secondary">
              Delete
          </Button>
        </DialogActions>
      </Dialog>
    );

    /** DSLR Generator preview and deploy pop-up */
  const renderRulesGeneratorPreview = () =>
    (
      <Dialog
        fullWidth
        maxWidth="lg"
        open
        // onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Exported Rules</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description2"
            // ref={descriptionElementRef}
            tabIndex={-1}
          >
            {/* <div style={{ whiteSpace: 'pre-line' }}>{downloadDialogText}</div> */}
            <AceEditor
              mode="java"
              theme="github"
              name="codepreview_panel" // need to provide a unique id for the code-box
              width="100%"
              // onLoad={this.onLoad}
              fontSize={14}
              showGutter
              highlightActiveLine
              value={dialogText}
              maxLines={45}
              minLines={45}
              readOnly
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmitDownloadRules} color="primary"> {/* TODO: Download click */}
            Download
          </Button>
          <Button onClick={onSubmitDeployRules} color="primary"> {/* TODO: Download click */}
            Deploy
          </Button>
        </DialogActions>
      </Dialog>
    );

  // Servers ids aggregation
  const allServersIds = allServers.map(server => server.get('_id'));
  // Tags ids aggregation
  const allTagsIds = allTags.map(tag => tag.get('_id'));

  /** Renders the import files dropzone */
  const renderFileDropZone = () => (
    <Dialog
      open
      // onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Select Files</DialogTitle>
      <DialogContent dividers>
        <DialogContentText
          id="scroll-dialog-description3"
          // ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Dropzone onDrop={handleFileDrops} accept=".dslr" maxSize={20971520}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Drag &apos;n&apos; drop some .dslr files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
          {(selectedFiles || []).map(file => (
            <li key={file.path}>
              {file.path} - {file.size} bytes
            </li>
          ))}
          <br /><br />
          <TableRow className={classes.root} style={{ borderBottom: 'unset' }}>
            <TableCell align="left" style={{ borderBottom: 'unset', padding: '0 0 0 16px' }}>
              Servers
            </TableCell>
            <TableCell align="left" style={{ borderBottom: 'unset', padding: '0 0 0 16px' }}>
              Tags
            </TableCell>
          </TableRow>
          <TableRow className={classes.root} style={{ borderBottom: 'unset' }}>
            <TableCell align="left">
              <MultiSelectConfig
                updateRow={setSelectedServer}
                cellData={{
                  name: 'servers', // field name, neccessary for redux UPDATE cell action
                  value: selectedServer.target.value, // ??? i can explain... MultiSelectConfig was built to emit the whole event objects not just the value (event carries more detailed payload for redux-store)
                  id: '1453',
                }}
                edited
                key="import-rules-servers"
                allOptions={allServers.toJS()} // needs conversion to plain array
                activeOptions={allServersIds.toJS()}
                multiple
              />
            </TableCell>
            <TableCell align="left">
              <MultiSelectConfig
                updateRow={setSelectedTag}
                cellData={{
                  name: 'tags', // field name, neccessary for redux UPDATE cell action
                  value: selectedTag.target.value, // ??? i can explain... MultiSelectConfig was built to emit the whole event objects not just the value (event carries more detailed payload for redux-store)
                  id: '2345354',
                }}
                edited
                key="import-rules-tags"
                allOptions={allTags.toJS()} // needs conversion to plain array
                activeOptions={allTagsIds.toJS()}
                multiple
              />
            </TableCell>
          </TableRow>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
              Cancel
        </Button>
        <Button
          disabled={!selectedFiles}
          onClick={() => onSubmitImportedRules(selectedServer.target.value, selectedTag.target.value, selectedFiles)} // TODO: this is scarry. Pls change emmited values
          color="primary"
        >
            OK
        </Button>
      </DialogActions>
    </Dialog>
  );

  /** Renders the text editor for single-rule import */
  const createNewRule = () => (
    <Dialog
      fullWidth
      maxWidth="md"
      open
      // onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Create New Rule</DialogTitle>
      <DialogContent dividers>
        <DialogContentText
          id="scroll-dialog-description4"
          // ref={descriptionElementRef}
          tabIndex={-1}
        >
          <TableRow className={classes.root} style={{ borderBottom: 'unset' }}>
            <TableCell align="left" style={{ borderBottom: 'unset', padding: '0 0 0 16px' }}>
                Servers
            </TableCell>
            <TableCell align="left" style={{ borderBottom: 'unset', padding: '0 0 0 16px' }}>
                Tags
            </TableCell>
          </TableRow>
          <TableRow className={classes.root} style={{ borderBottom: 'unset' }}>
            <TableCell align="left">
              <MultiSelectConfig
                updateRow={setSelectedServer}
                cellData={{
                  name: 'servers', // field name, neccessary for redux UPDATE cell action
                  value: selectedServer.target.value, // ??? i can explain... MultiSelectConfig was built to emit the whole event objects not just the value (event carries more detailed payload for redux-store)
                  id: '1453',
                }}
                edited
                key="import-rules-servers"
                allOptions={allServers.toJS()} // needs conversion to plain array
                activeOptions={allServersIds.toJS()}
                multiple
              />
            </TableCell>
            <TableCell align="left">
              <MultiSelectConfig
                updateRow={setSelectedTag}
                cellData={{
                  name: 'tags', // field name, neccessary for redux UPDATE cell action
                  value: selectedTag.target.value, // ??? i can explain... MultiSelectConfig was built to emit the whole event objects not just the value (event carries more detailed payload for redux-store)
                  id: '2345354',
                }}
                edited
                key="import-rules-tags"
                allOptions={allTags.toJS()} // needs conversion to plain array
                activeOptions={allTagsIds.toJS()}
                multiple
              />
            </TableCell>
          </TableRow>
          <br />
          <AceEditor
            mode="java"
            theme="github"
            name="codepreview_panel" // need to provide a unique id for the code-box
            width="100%"
            onChange={handleRuleCodeChange}
            fontSize={14}
            showGutter
            highlightActiveLine
            value={ruleCodeContent}
            maxLines={45}
            minLines={40}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!ruleCodeContent}
          onClick={() => onSubmitCreatedRule(selectedServer.target.value, selectedTag.target.value, ruleCodeContent)} // TODO: this is scarry. Pls change emmited values
          color="primary"
        >
          Submit new rule
        </Button>
      </DialogActions>
    </Dialog>
  );

  switch (dialogType) {
    case 'error':
      return renderError();
    case 'confirm delete':
      return renderDeleteRuleConfirmation();
    case 'rules list':
      return renderRulesGeneratorPreview();
    case 'drop files':
      return renderFileDropZone();
    case 'create new rule':
      return createNewRule();
    default: return (<br />);
  }
}

PopUp.propTypes = {
  allServers: PropTypes.array.isRequired,
  allTags: PropTypes.array.isRequired,
  dialogText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  dialogType: PropTypes.string.isRequired,
  onSubmitImportedRules: PropTypes.func,
  onSubmitCreatedRule: PropTypes.func,
  onConfirmDeleteRule: PropTypes.func,
};

/**
 * Access to Incoming state (data)
 * @param {Object} state
 */
const mapStateToProps = state =>
  ({
    force: state, // force state from reducer
    allServers: state.getIn(['ServersConfig', 'dataTable']), // injecting servers config for chips id-to-label conversion
    allTags: state.getIn(['TagsConfig', 'dataTable']), // injecting se
  });

/**
 * Connecting state w/ props
 */
const PopUpMapped = connect(
  mapStateToProps,
  null
)(PopUp);

export default PopUpMapped;
