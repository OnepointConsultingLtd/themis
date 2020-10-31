import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import { Snackbar, IconButton } from '@material-ui/core';

const styles = theme => ({
  close: {
    width: theme.spacing(4),
  },
});

const severityRef = {
  success: '#4caf50', // #EC407A That's the secondary material color
  error: '#f44336'
};

class Notification extends React.Component {
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.props.close();
  };

  render() {
    const { classes, message, severity } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
          color: 'red'
        }}
        open={message !== ''}
        autoHideDuration={5000}
        onClose={() => this.handleClose()}
        ContentProps={{
          'aria-describedby': 'message-id',
          style: { backgroundColor: severityRef[severity] }
        }}
        message={message}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={() => this.handleClose()}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }
}

Notification.propTypes = {
  classes: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.string.isRequired,
};

export default withStyles(styles)(Notification);
