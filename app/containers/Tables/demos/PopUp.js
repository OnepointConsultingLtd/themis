import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// import MultiSelectConfig from 'ba-components/Tables/tableParts/MultiSelectConfig';
import { makeStyles } from '@material-ui/core/styles';
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
import Autocomplete from './autocomplete';

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
  onSubmitDeployRules, allServers, allTags, dialogArray
}) {
  const classes = useRowStyles();
  const [selectedFiles, setSelectedFiles] = useState(); // DEBUGGED: needed empty init state and not ([])
  const [ruleCodeContent, setRuleCodeContent] = useState();
  const [selectedServer, setSelectedServer] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);

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

  const renderValidationErrors = () =>
    (
      <Dialog
        open
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Validation Error</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description1"
            tabIndex={-1}
          >
            <div>{dialogArray.map(error => (<div>{error}</div>))}</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
              Close
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
          <Button onClick={onSubmitDownloadRules} color="primary">
            Download
          </Button>
          <Button onClick={onSubmitDeployRules} color="primary">
            Deploy
          </Button>
        </DialogActions>
      </Dialog>
    );

  // // Servers ids aggregation
  // const allServersIds = allServers.map(server => server.get('_id'));
  // // Tags ids aggregation
  // const allTagsIds = allTags.map(tag => tag.get('_id'));

  /** Renders the import files dropzone */
  const renderImportDLSRFile = () => (
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
            <TableCell align="left" style={{ minWidth: '200px' }}>
              <Autocomplete
                options={allServers.toJS()}
                value={selectedServer} // value is the array of ids
                onChange={(e, newValue) => {
                  // console.log(newValue);
                  setSelectedServer(newValue);
                }}
                noUnderline={false}
              />
            </TableCell>
            <TableCell align="left" style={{ minWidth: '200px' }}>
              <Autocomplete
                options={allTags.toJS()}
                value={selectedTag} // value is the array of ids
                onChange={(e, newValue) => {
                  // console.log(newValue);
                  setSelectedTag(newValue);
                }}
                noUnderline={false}
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
          onClick={() => onSubmitImportedRules(selectedServer.length === 0 ? ['NA'] : selectedServer, selectedTag, selectedFiles)} // TODO: this is scarry. Pls change emmited values
          color="primary"
        >
            OK
        </Button>
      </DialogActions>
    </Dialog>
  );

  /** Renders the text editor for single-rule import */
  const renderCreateNewRule = () => (
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
            <TableCell align="left" style={{ minWidth: '200px' }}>
              <Autocomplete
                options={allServers.toJS()}
                value={selectedServer} // value is the array of ids
                onChange={(e, newValue) => {
                  // console.log(newValue);
                  setSelectedServer(newValue);
                }}
                noUnderline={false}
              />
            </TableCell>
            <TableCell align="left" style={{ minWidth: '200px' }}>
              <Autocomplete
                options={allTags.toJS()}
                value={selectedTag} // value is the array of ids
                onChange={(e, newValue) => {
                  // console.log(newValue);
                  setSelectedTag(newValue);
                }}
                noUnderline={false}
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
          onClick={() => onSubmitCreatedRule(selectedServer.length === 0 ? ['NA'] : selectedServer, selectedTag, ruleCodeContent)} // TODO: this is scarry. Pls change emmited values
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
    case 'validation error':
      return renderValidationErrors();
    case 'confirm delete':
      return renderDeleteRuleConfirmation();
    case 'rules list':
      return renderRulesGeneratorPreview();
    case 'drop files':
      return renderImportDLSRFile();
    case 'create new rule':
      return renderCreateNewRule();
    default: return (<br />);
  }
}

PopUp.propTypes = {
  allServers: PropTypes.array.isRequired,
  allTags: PropTypes.array.isRequired,
  dialogText: PropTypes.string,
  dialogArray: PropTypes.array,
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
