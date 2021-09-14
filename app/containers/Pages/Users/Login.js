import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'ba-api/brand';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Type from 'ba-styles/Typography.scss';
import ArrowForward from '@material-ui/icons/ArrowForward';
import logo from 'ba-images/theta-logo.png';
import LoginForm from 'ba-components/Forms/LoginForm';
import styles from 'ba-components/Forms/user-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loginAction } from 'ba-actions/loginActions';
import { Grid, Hidden, Typography } from '@material-ui/core';

class Login extends React.Component {
  // state = {
  //   valueForm: []
  // }

  submitForm(values) {
    // console.log('####### LOGIN FORM VALUES: ', values);
    // setTimeout(() => {
    // this.setState({ valueForm: values });
    // console.log(`You submitted:\n\n${this.state.valueForm}`);
    // window.location.href = '/app';    /// window.location causes app reload. Resolved w/ proper history use
    this.props.loginAction(values); // redux login-action dispatch
    // }, 500); // simulate server latency //// BUG: conflicts login-form submission - REMOVED
  }

  render() {
    const title = brand.name + ' - Login';
    const description = brand.desc;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <div className={classes.container}>
          <Grid container spacing={3} alignItems="center" direction="row" justify="center">
            <Grid item container justify="center" spacing={0} className={classes.loginWrap}>
              <Hidden smDown>
                <Grid item md={6} className={classes.welcomeWrap}>
                  {/* Welcome Login */}
                  <div className={classes.welcome} style={{ backgroundColor: '#b196df' }}>
                    <div className={classes.welcomeContent}>
                      <div className={classes.brand}>
                        <img src={logo} alt={brand.name} style={{ width: '250px', marginTop: '170px', marginLeft: '20px' }} />
                        {/* <h3>{brand.name}</h3> */}
                      </div>
                      {/* <Typography variant="h3">
                        <span className={Type.light}>Hello there,</span>
                      </Typography>*/}
                      <Typography variant="h6" className={classes.brandText} style={{ marginTop: '170px', marginLeft: '90px', color: 'white'}}>
                        <span className={Type.regular}>
                          Taking Rules forward
                          {/* {' '}
                          {brand.name} */}
                        </span>
                      </Typography> 
                    </div>
                    <ArrowForward className={classes.decoBottom} />
                  </div>
                </Grid>
              </Hidden>
              <Grid item md={6} sm={8} xs={11}>
                {/* ----------------------------------------------------------------------*/}
                {/* Load Login Form */}
                <LoginForm onSubmit={(values) => this.submitForm(values)} />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginAction: PropTypes.func.isRequired
};

/**
 * Outgoing events (actions) w/ or w/out payload
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => ({
  loginAction: bindActionCreators(loginAction, dispatch),
});

/**
 * Connecting state w/ props
 */
const LoginMapped = connect(
  null,
  mapDispatchToProps
)(Login);

export default withStyles(styles)(LoginMapped);
