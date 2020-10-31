import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PostAddIcon from '@material-ui/icons/PostAdd';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

class CustomToolbar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Tooltip title="Import Rules">
          <IconButton onClick={this.props.onClickImportRules}>
            <PostAddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="add new Rules">
          <IconButton onClick={this.props.onClickCreateRule}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }
}

CustomToolbar.propTypes = {
  onClickImportRules: PropTypes.func.isRequired,
  onClickCreateRule: PropTypes.func.isRequired
};

export default CustomToolbar;
