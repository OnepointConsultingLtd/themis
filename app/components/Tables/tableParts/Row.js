import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/BorderColor';
import DoneIcon from '@material-ui/icons/Done';
import css from 'ba-styles/Table.scss';
import EditableCell from './EditableCell';
import SelectableCell from './SelectableCell';
import MultiSelectConfigWired from './MultiSelectConfigWired';
import ToggleCell from './ToggleCell';
import DatePickerCell from './DatePickerCell';
import TimePickerCell from './TimePickerCell';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class Row extends React.Component {
  render() {
    const {
      classes,
      schema,
      item,
      removeRow,
      updateRow,
      editRow,
      finishEditRow,
      branch
    } = this.props;
    // console.log('>>>> ITEM DATA ARRIVED FROM PARENT: ', item);
    const eventDel = () => {
      removeRow(item, branch);
    };
    const eventEdit = () => {
      editRow(item, branch);
    };
    const eventDone = () => {
      finishEditRow(item, branch);
    };
    const renderAllCellsFromSchema = schemaArray => schemaArray.map((schemaItem, index) => {
      if (schemaItem.name !== 'action' && !schemaItem.hidden) {
        const inputType = schemaItem.type;
        switch (inputType) {
          case 'selection':
            return (
              <SelectableCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{ // schema data
                  name: schemaItem.name,
                  value: item.get(schemaItem.name),
                  id: item.get('_id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                options={schemaItem.options}
                branch={branch}
                multiple={false}
              />
            );
          case 'redux-multiselection':
            return (
              <MultiSelectConfigWired
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  name: schemaItem.name,
                  value: item.get(schemaItem.name), // immutable
                  id: item.get('_id'), // immutable
                }}
                edited={item.get('edited')}
                key={index.toString()}
                branch={schemaItem.reduxBranch} // tapping into a specific redux branch
                dataTable={schemaItem.reduxDataTable} // tapping into a specific redux branch
                optionsField={schemaItem.reduxField} // specific field to aggregate values from
              />
            );
          case 'toggle':
            return (
              <ToggleCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  type: schemaItem.name,
                  value: item.get(schemaItem.name),
                  id: item.get('_id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                branch={branch}
              />
            );
          case 'date':
            return (
              <DatePickerCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  type: schemaItem.name,
                  value: item.get(schemaItem.name),
                  id: item.get('_id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                branch={branch}
              />
            );
          case 'time':
            return (
              <TimePickerCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  type: schemaItem.name,
                  value: item.get(schemaItem.name),
                  id: item.get('_id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                branch={branch}
              />
            );
          default:
            return (
              <EditableCell
                updateRow={(event) => updateRow(event, branch)}
                cellData={{
                  type: schemaItem.name,
                  value: item.get(schemaItem.name),
                  id: item.get('_id'),
                }}
                edited={item.get('edited')}
                key={index.toString()}
                inputType={inputType}
                branch={branch}
              />
            );
        }
      }
      return false;
    });
    return (
      <tr className={item.get('edited') ? css.editing : ''}>
        {renderAllCellsFromSchema(schema)}
        <TableCell padding="none">
          <IconButton
            onClick={() => eventEdit(this)}
            className={classNames((item.get('edited') ? css.hideAction : ''), classes.button)}
            aria-label="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => eventDone(this)}
            color="secondary"
            className={classNames((!item.get('edited') ? css.hideAction : ''), classes.button)}
            aria-label="Done"
          >
            <DoneIcon />
          </IconButton>
          <IconButton
            onClick={() => eventDel(this)}
            className={classes.button}
            aria-label="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </tr>
    );
  }
}

Row.propTypes = {
  classes: PropTypes.object.isRequired,
  schema: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  removeRow: PropTypes.func.isRequired,
  updateRow: PropTypes.func.isRequired,
  editRow: PropTypes.func.isRequired,
  finishEditRow: PropTypes.func.isRequired,
  branch: PropTypes.string.isRequired
};

export default withStyles(styles)(Row);
