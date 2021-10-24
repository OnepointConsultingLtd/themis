
import React from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import css from 'ba-styles/Table.scss';

/**
 * Selection drop down, used in Generators Config Tab,
 * and has direct access to configuration tables redux
 */
class MultiSelectConfigWired extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // this.state = { selectionvalue: props.cellData.value };
  // }

  handleChange = event => {
    let { value } = event.target;

    // necessary selection validations ('NA' shouldn't be selectable but should show when nothing is selected)
    if (value.length === 0) value = ['NA'];
    else
    if (value.includes('NA')) {
      value.splice(value.indexOf('NA'), 1);
    }

    console.log('Selection updated', event.target.value, event, this.props.cellData);
    // this.setState({ selectionvalue: value });
    this.props.updateRow(event); // TODO: Check if we really want app-state update here
  };

  render() {
    const {
      cellData,
      edited,
      allOptionsTable, // immutable
      optionsField,
    } = this.props;

    console.log('current value: ', cellData.value);

    return (
      <React.Fragment>
        <TableCell padding="none">
          <Select
            name={cellData.name}
            id={cellData.id.toString()}
            className={css.crudInput}
            value={(cellData.value || List([])).toJS()} // array type because we are in multiselect
            onChange={this.handleChange}
            displayEmpty
            disabled={!edited}
            margin="none"
            multiple
          >
            <MenuItem value="NA" disabled>
              NA
            </MenuItem>
            {allOptionsTable.toJS().map((option, index) =>
              <MenuItem value={option._id} key={index.toString()}>{option[optionsField]}</MenuItem>
            )}
          </Select>
        </TableCell>
      </React.Fragment>
    );
  }
}

MultiSelectConfigWired.propTypes = {
  allOptionsTable: PropTypes.object.isRequired,
  cellData: PropTypes.object.isRequired,
  updateRow: PropTypes.func.isRequired,
  edited: PropTypes.bool.isRequired,
  optionsField: PropTypes.string.isRequired,
  // multiple: PropTypes.bool.isRequired,
};


/**
 * Incoming state (rule data and configuration tables)
 * @param {Object} state
 */
const mapStateToProps = (state, ownProps) => ({
  force: state, // force state from reducer
  allOptionsTable: state.getIn([ownProps.branch, ownProps.dataTable]), // injecting generators config here
});

/**
 * Connecting state w/ props
 */
const MultiSelectConfigWiredMapped = connect(
  mapStateToProps,
  null
)(MultiSelectConfigWired);

export default MultiSelectConfigWiredMapped;
