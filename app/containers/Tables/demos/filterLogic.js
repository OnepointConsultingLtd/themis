
import React from 'react';
import {
  FormControl,
  ListItemText,
  Checkbox,
  Select,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import { idsToLabels } from './idsToProperties';
import Autocomplete from './autocomplete';

/** Describes the filter logic and filters rendering for RulesManagerParentTable component
 * @param {config table}: multiSelectOptions
 * @param { string }: Selector label
 * @param { boolean }: Type of selector: true: multi | false: single
*/
const filterOptions = (multiSelectOptions, Label, type = true) => {
  switch (type) {
    case true: // MUTLISELECTOR --------------
      return ({
        /**
        * matchedFieldValues:
        * selectedFilter:
        * row:
        */
        logic: (matchedFieldValues, selectedFilter, row) => { // matched are the matched values in the current row. might be all might some
          // console.log('LOGIC: ', matchedFieldValues, selectedFilter, row);
          if (selectedFilter.length === 0) return false; // on startup don't filter anything
          else if (matchedFieldValues.length > 0) {
            // console.log(selectedFilter.some(r => matchedServerField.indexOf(r) > -1));
            // return !selectedFilter.some(r => matchedServerField.indexOf(r) > -1); // MATCH IF ANY
            return !selectedFilter.every(v => matchedFieldValues.includes(v)); // MATCH ALL!
          }
          return true; // ---> fallback to true = EXCLUDE if filter is activated but doesnt match the current row
        },
        /**
        * filterList: array of all columns selected filters,
        * index: index of the current column
        * column: filter-column data object
        */

        display: (filterList, onChange, index, column) => {
          // console.log('Some useful filter logistics : ', filterList, index, column);
          return (
            <div>
              <div>
                {Label}
              </div>
              <Autocomplete
                options={multiSelectOptions}
                value={filterList[index]} // value is the array of ids
                onChange={(e, newValue) => {
                  console.log(newValue);
                  onChange(newValue, index, column);
                }}
                noUnderline={false}
              />
            </div>);

          // return (
          //   <FormControl>
          //     <InputLabel htmlFor="select-multiple-chip">
          //       {Label}
          //     </InputLabel>
          //     <Select
          //       multiple
          //       value={filterList[index]}
          //       renderValue={selected => selected.map(id => idsToLabels(multiSelectOptions)[id]).join(', ')} // render selected values not as array of id's but array of labels. We need the id2label conversion
          //       onChange={event => {

          //         // filterList[index] = event.target.value;
          //         onChange(event.target.value, index, column);
          //       }}
          //     >
          //       {multiSelectOptions.map(item => (
          //         <MenuItem key={item._id} value={item._id}>
          //           <Checkbox
          //             color="primary"
          //             checked={filterList[index].indexOf(item._id) > -1}
          //           />
          //           <ListItemText primary={item.label} />
          //         </MenuItem>
          //       ))}
          //     </Select>
          //   </FormControl>
          // );
        }
      });
    case false: // SINGLE SELECTOR -----------------
      return ({
        // logic: (matchedServerField, selectedFilter, row) => {           //// !!!! NO SPECIAL LOGIC REQUIRED WHEN SINLGE SELECTOR
        //   console.log('LOGIC: ', matchedServerField, selectedFilter, row);
        //   // console.log(matchedServerField.length);
        //   if (selectedFilter) return false; // on startup don't filter anything
        //   else if (matchedServerField.length > 0) {
        //     console.log(matchedServerField.includes(selectedFilter));
        //     return !matchedServerField.includes(selectedFilter);
        //   }
        //   return true; // ---> fallback to true = EXCLUDE if filter is activated but doesnt match this row
        // },
        display: (filterList, onChange, index, column) =>
          // console.log('Some useful filter logistics : ', filterList, index, column);
          (
            <FormControl>
              <InputLabel htmlFor="select-multiple-chip">
                {Label}
              </InputLabel>
              <Select
                value={filterList[index]}
                renderValue={selected => idsToLabels(multiSelectOptions)[selected]} // render selected values not as array of id's but array of labels. We need the id2label conversion
                onChange={event => {

                  filterList[index] = [event.target.value]; // selected _id as an array, though (painful DEBUG)
                  onChange(filterList[index], index, column);
                }}
              >
                {multiSelectOptions.map(item => (
                  <MenuItem key={item._id} value={item._id}>
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
      });
    default:
  }
  return false;
};

export default filterOptions;
