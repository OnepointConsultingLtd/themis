
import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import css from 'ba-styles/Table.scss';

/**
 * Selection drop down which is used in RulesManager rule versions panel.
 * It has no direct access to any redux store
 */
class MultiSelectConfig extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { selectionvalue: props.cellData.value };
  // }

  handleChange = event => {
    let { value } = event.target;

    // necessary selection validations ('NA' shouldn't be selectable but should show when nothing is selected)
    if (value.length === 0) value = ['NA'];
    else
    if (value.includes('NA')) {
      value.splice(value.indexOf('NA'), 1);
    }

    // this.setState({ selectionvalue: value });
    this.props.updateRow(event); // ATTENTION: emmitting the whole event object here
  };

  render() {
    const {
      cellData,
      edited,
      allOptions, // all server's records list
      multiple,
      activeOptions, // available server's ids
    } = this.props;

    return (
      <React.Fragment>
        <TableCell padding="none">
          <Select
            name={cellData.name}
            id={cellData.id.toString()}
            className={css.crudInput}
            // value={this.state.selectionvalue}
            value={cellData.value} // array type because we are in multiselect
            onChange={this.handleChange}
            displayEmpty
            disabled={!edited}
            margin="none"
            multiple={multiple}
          >
            <MenuItem value="NA" disabled>
              NA
            </MenuItem>
            {allOptions.map((option, index) => {
              if (activeOptions.includes(option._id) || this.state.selectionvalue.includes(option._id)) { // active options is dynamic data
                return (<MenuItem value={option._id} key={index.toString()}>{option.label}</MenuItem>);
              }
              return (<MenuItem value={option._id} disabled key={index.toString()}>{option.label}</MenuItem>);
            })}
          </Select>
        </TableCell>
      </React.Fragment>
    );
  }
}

MultiSelectConfig.propTypes = {
  allOptions: PropTypes.array.isRequired,
  cellData: PropTypes.object.isRequired,
  updateRow: PropTypes.func.isRequired,
  edited: PropTypes.bool.isRequired,
  activeOptions: PropTypes.array.isRequired,
  multiple: PropTypes.bool.isRequired,
};

export default MultiSelectConfig;
