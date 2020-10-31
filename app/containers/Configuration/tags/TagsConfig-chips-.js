import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ChipInput from 'material-ui-chip-input';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  // fetchAction, // TODO after connection to server uncomment fetchAction
  addAction,
  removeAction,
  closeNotifAction,
} from 'ba-actions/CrudTbActions';


function TagsConfig() {
  const [tagChips, updateTagChips] = useState();

  const handleAddChip = (chip) => {
    updateTagChips(tagChips.push(chip));
  };

  // eslint-disable-next-line no-unused-vars
  const handleDeleteChip = (chip, index) => {
    updateTagChips(tagChips.slice(index, 1));
  };

  return (
    <div>
      <Typography gutterBottom variant="body1" style={{ minWidth: '150px' }}>
            Start typing. Press space or enter after each tag you wish to submit.
      </Typography>
      <br />
      <ChipInput
        value={tagChips}
        onAdd={(chip) => handleAddChip(chip)}
        onDelete={(chip, index) => handleDeleteChip(chip, index)}
        newChipKeyCodes={[13, 32]}
      />
    </div>
  );
}

TagsConfig.propTypes = {
  branch: PropTypes.string.isRequired,
  dataSchema: PropTypes.array.isRequired,
  addEmptyRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
  severityNotif: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => ({ // own props used to access props and fetch branch
  force: state, // force state from reducer
  messageNotif: state.getIn([ownProps.branch, 'notifMsg']),
  severityNotif: state.getIn([ownProps.branch, 'notifSeverity']),
});
const mapDispatchToProps = dispatch => ({
  // fetchData: bindActionCreators(fetchAction, dispatch),
  addEmptyRow: bindActionCreators(addAction, dispatch),
  removeRow: bindActionCreators(removeAction, dispatch),
  closeNotif: bindActionCreators(closeNotifAction, dispatch),
});

const TagsConfigMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsConfig);

export default TagsConfigMapped;
