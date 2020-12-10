import React from 'react';
import PropTypes from 'prop-types';
import AutocompleteMUI from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export default function Autocomplete(props) {
  const {
    value, onChange, options, noUnderline, placeholder
  } = props;
  // console.log(options);
  const stopPropagation = (e) => e.stopPropagation();

  return (<AutocompleteMUI
    // disabled // TODO: connect to lockedRows
    autoComplete
    autoHighlight
    multiple
    autoSelect
    disableClearable
    disableCloseOnSelect
    // blurOnSelect="mouse"
    limitTags={4}
    filterSelectedOptions
    options={options.map(item => item._id)} // options as array of id(s)
    getOptionLabel={(option) => {
      // console.log(option, options);
      const index = options.findIndex(i => i._id === option);
      return (options[index] || '').label;
    }}
    getOptionSelected={(option, currValue) => (currValue || '').includes(option)}
    value={value} // value as array of id(s)
    onChange={onChange}
    onOpen={stopPropagation}
    onClose={stopPropagation}
    renderInput={(params) => (
      <TextField
        onClick={stopPropagation}
        {...params}
        placeholder={placeholder}
        InputProps={{ ...params.InputProps, disableUnderline: noUnderline }}
      />
    )}
  />);
}

// return (<Autocomplete
//   // disabled // TODO: connect to lockedRows
//   autoComplete
//   autoHighlight
//   multiple
//   autoSelect
//   disableClearable
//   limitTags={5}
//   options={options} // all options as labels
//   filterSelectedOptions
//   value={value} // value is the array of labels
//   onChange={onChange}
//   onOpen={stopPropagation}
//   onClose={stopPropagation}
//   renderInput={(params) => (
//     <TextField
//       onClick={stopPropagation}
//       {...params}
//       InputProps={{ ...params.InputProps, disableUnderline: true }}
//     />
//   )}
// />);
// }

Autocomplete.defaultProps = {
  noUnderline: true,
  placeholder: ''
};

Autocomplete.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  noUnderline: PropTypes.bool,
  placeholder: PropTypes.string,
};
