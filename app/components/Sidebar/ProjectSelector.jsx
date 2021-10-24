import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import classNames from 'classnames';

const styles = () => ({
  root: {
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
      color: 'white'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
      color: 'white',
    },
    '&&': {
      color: 'white',
    },
    '& .MuiSelect-icon': {
      color: 'white',
    }
  }
});

const projectList = [ // TODO: pull projects-list from database. Currently hardcoded
  {
    _id: '1',
    name: 'PRJ1'
  },
  {
    _id: '2',
    name: 'PRJ2'
  },
  {
    _id: '3',
    name: 'PRJ3'
  }
];

const ProjectSelector = ({ classes }) => {
  const [project, setProject] = useState('1'); // TODO: current selected project should be pulled from Redux store

  return (
    <FormControl variant="outlined" style={{ width: '100%', marginTop: '25px' }}>
      <InputLabel style={{ color: 'white' }} htmlFor="outlined-age-native-simple">Project</InputLabel>
      <Select
        className={classes.root}
        value={project}
        onChange={(e) => { console.log(e.target.value); setProject(e.target.value); }}
        label="Project"
      >
        {projectList.map(item => (
          <MenuItem value={item._id} style={{ float: 'clear' }}>
            <div style={{ width: '100%' }}><div style={{ display: 'inline' }} >{item.name}</div>
              {(project !== item._id) && (<div style={{ display: 'inline', float: 'right' }} ><DeleteIcon /></div>)} {/* TODO: maybe remove icon */}
            </div>
          </MenuItem>)
        )}
        <Tooltip title="Add new project">
          <Button variant="text" onClick={() => {}} color="secondary" style={{ width: '100%' }} className={classes.button}>
            <AddCircleOutlineIcon className={classNames(classes.leftIcon, classes.iconSmall)} style={{ marginRight: '8px' }} />
                Add New
          </Button>
        </Tooltip>
      </Select>
    </FormControl>
  );
};

ProjectSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectSelector);
