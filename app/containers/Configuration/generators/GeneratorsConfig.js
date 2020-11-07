import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CrudTable from '../../Tables/demos/CrudTable';
import { generatorsConfigSchema } from '../../Tables/demos/data';

const styles = ({
  root: {
    flexGrow: 1,
  }
});

const branch = 'GeneratorsConfig';

class GeneratorsConfig extends Component {
  render() {
    return (
      <div>
        <CrudTable branch={branch} dataSchema={generatorsConfigSchema} /> {/* Reducer Branch */}
      </div>
    );
  }
}

export default withStyles(styles)(GeneratorsConfig);
