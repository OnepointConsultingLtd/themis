import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import css from 'ba-styles/Table.scss';
import Row from './Row';
import styles from './tableStyle-jss';

class MainTable extends React.Component {
  render() {
    const {
      classes,
      items,
      addEmptyRow,
      removeRow,
      updateRow,
      editRow,
      finishEditRow,
      schema,
      branch,
      // title
    } = this.props;
    const getItems = dataArray => dataArray.map(item =>
      (
        <Row
          schema={schema}
          updateRow={(event) => updateRow(event, item, branch)}
          item={item}
          removeRow={() => removeRow(item, branch)}
          key={item.get('id')}
          editRow={() => editRow(item, branch)}
          finishEditRow={() => finishEditRow(item, branch)}
          branch={branch}
        />
      )
    );

    const getHead = schemaArray => schemaArray.map((item, index) => {
      if (!item.hidden) {
        return (
          <TableCell padding="none" key={index.toString()} width={item.width}>{item.label}</TableCell>
        );
      }
      return false;
    });

    return (
      <div>
        <div style={{ float: 'right' }}>
          <Tooltip title="Add item">
            <Button variant="text" style={{ margin: '0' }} onClick={() => addEmptyRow(schema, branch)} color="secondary" className={classes.button}>
              <AddCircleOutlineIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Add New
            </Button>
          </Tooltip>
        </div>
        <div className={classes.rootTable}>
          <Table className={classNames(css.tableCrud, classes.table, css.stripped)} style={{ marginTop: '0' }}>
            <TableHead>
              <TableRow>
                { getHead(schema) }
              </TableRow>
            </TableHead>
            <TableBody>
              {getItems(items)}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

MainTable.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.object.isRequired,
  schema: PropTypes.array.isRequired,
  addEmptyRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  updateRow: PropTypes.func.isRequired,
  editRow: PropTypes.func.isRequired,
  finishEditRow: PropTypes.func.isRequired,
  branch: PropTypes.string.isRequired
};

export default withStyles(styles)(MainTable);
