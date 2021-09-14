/* eslint-disable react/require-default-props */
/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
// import { PapperBlock } from 'ba-components';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import TextField from '@material-ui/core/TextField';
import ServersConfig from './servers/ServersConfig';
import TagsConfig from './tags/TagsConfig';
import GeneratorsConfig from './generators/GeneratorsConfig';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Paper style={{ padding: '25px' }}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            {/* <Tab label="Rule ID" {...a11yProps(0)} /> */}
            <Tab label="Tags" {...a11yProps(0)} />
            <Tab label="Deployers" {...a11yProps(1)} />
            <Tab label="Target Servers" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        {/* <TabPanel value={value} index={0}>
              TODO: Rule ID. Future feature in the case of rule ID included inside the rule-name
        </TabPanel> */}
        <TabPanel value={value} index={0}>
          <TagsConfig />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <GeneratorsConfig />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ServersConfig />
        </TabPanel>


      </Paper>
    </div>
  );
}


export default SimpleTabs;
