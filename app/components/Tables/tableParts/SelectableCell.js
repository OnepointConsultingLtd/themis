
import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import css from 'ba-styles/Table.scss';

/**
 * Selection drop down
 */
class SelectableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectionvalue: props.cellData.value };
  }

  handleChange = event => {
    console.log('Selection updated', event.target.value, event, this.props.cellData);
    this.setState({ selectionvalue: event.target.value });
    this.props.updateRow(event, this.props.branch);
  };

  render() {
    const {
      cellData,
      edited,
      options,
    } = this.props;
    return (
      <TableCell padding="none">
        <Select
          name={cellData.name}
          id={cellData.id.toString()}
          className={css.crudInput}
          value={this.state.selectionvalue}
          onChange={this.handleChange}
          displayEmpty
          disabled={!edited}
          margin="none"
        >
          {options.map((option, index) => <MenuItem value={option} key={index.toString()}>{option}</MenuItem>)}
        </Select>
      </TableCell>
    );
  }
}

SelectableCell.propTypes = {
  options: PropTypes.array.isRequired,
  cellData: PropTypes.object.isRequired,
  updateRow: PropTypes.func.isRequired,
  edited: PropTypes.bool.isRequired,
  branch: PropTypes.string.isRequired,
};

export default SelectableCell;
