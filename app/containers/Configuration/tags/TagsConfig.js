import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CrudTable from '../../Tables/demos/CrudTable';
import { tagsConfigSchema } from '../../Tables/demos/data';

const styles = ({
  root: {
    flexGrow: 1,
  }
});

const branch = 'TagsConfig';

class TagsConfig extends Component {
  render() {
    return (
      <div>
        <CrudTable branch={branch} dataSchema={tagsConfigSchema} /> {/* Reducer Branch */}
      </div>
    );
  }
}

export default withStyles(styles)(TagsConfig);
