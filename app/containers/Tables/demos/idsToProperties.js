/** Converts an array of ids-labels to an object w/ ids as keys */
export const idsToLabels = (dataArray) =>
  dataArray.reduce((final, curr) => ({ ...final, [curr._id]: curr.label }), {}); // <----- id 2 labels !!!!

  /** Converts an array of ids-urls to an object w/ ids as keys */
export const idsToUrls = (dataArray) =>
  dataArray.reduce((final, curr) => ({ ...final, [curr._id]: curr.url }), {}); // <----- id 2 urls !!!!
