import React from 'react';
import PropTypes from 'prop-types';
import MainTable from './tableParts/MainTable';

class CrudTable extends React.Component {
  render() {
    const {
      title,
      dataTable,
      addEmptyRow,
      removeRow,
      updateRow,
      editRow,
      finishEditRow,
      anchor,
      branch
    } = this.props;
    // console.log('dataTable:', dataTable, 'anchor?: ', anchor);
    return (
      <MainTable
        title={title}
        addEmptyRow={addEmptyRow}
        items={dataTable}
        removeRow={removeRow}
        updateRow={updateRow}
        editRow={editRow}
        finishEditRow={finishEditRow}
        anchor={anchor}
        branch={branch}
      />
    );
  }
}

CrudTable.propTypes = {
  title: PropTypes.string.isRequired,
  anchor: PropTypes.array.isRequired,
  dataTable: PropTypes.object.isRequired,
  addEmptyRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  updateRow: PropTypes.func.isRequired,
  editRow: PropTypes.func.isRequired,
  finishEditRow: PropTypes.func.isRequired,
  branch: PropTypes.string.isRequired,
};

export default CrudTable;
