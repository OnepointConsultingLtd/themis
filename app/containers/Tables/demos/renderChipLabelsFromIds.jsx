import Chip from '@material-ui/core/Chip';
import React from 'react';
import { idsToLabels } from './idsToProperties';

/** Render any kind of chips */
const renderChips = (arrayOfValues, tableMeta, lockedRows) => {
  // console.log(arrayOfValues);
  let disabled;
  if ((lockedRows || []).includes(tableMeta.rowIndex)) { // show as grayed-out when row is locked
    disabled = true;
  } else disabled = false;
  return arrayOfValues
    .filter(value => value !== undefined && (value)) // deleted server or tag undefined chip
    .map(value => <Chip disabled={disabled} label={value} key={(+new Date() + Math.floor(Math.random() * 999999)).toString(36)} />);
};

/** Render servers chips */
export const renderServersChips = (allServers, arrayOfIds, tableMeta, lockedRows) => {
  // if (arrayOfIds.includes('NA')) { return ''; }
  // convert _id's to labels:
  // 1. create an object that has id-label as key-value pairs
  const idLabelObject = idsToLabels(allServers.toJS()); // <----- id 2 labels !!!!
  // 2. create final array of labels (substitute all ids w/ labels)
  const arrayOfLabels = arrayOfIds
    .filter(i => i !== 'NA') // filter-out all 'NA'
    .map(id => idLabelObject[id]);
  return renderChips(arrayOfLabels, tableMeta, lockedRows);
};

  /** Render tags chips */
export const renderTagsChips = (allTags, arrayOfIds, tableMeta, lockedRows) => {
  if (arrayOfIds.includes('NA')) { return ''; }
  // convert _id's to labels:
  // 1. create an object that has id-label as key-value pairs
  const idLabelObject = idsToLabels(allTags.toJS()); // <----- id 2 labels !!!!
  // 2. create final array of labels (substitute all ids w/ labels)
  const arrayOfLabels = arrayOfIds.map(id => idLabelObject[id]);
  return renderChips(arrayOfLabels, tableMeta, lockedRows);
};
