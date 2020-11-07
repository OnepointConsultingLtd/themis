/** Converts an array of ids-labels to an object w/ ids as keys */
export const idsToLabels = (dataArray) =>
  dataArray.reduce((final, curr) => ({ ...final, [curr._id]: curr.label }), {}); // <----- id 2 labels !!!!

  /** Converts an array of ids-urls to an object w/ ids as keys */
export const idsToUrls = (dataArray) =>
  dataArray.reduce((final, curr) => ({ ...final, [curr._id]: curr.url }), {}); // <----- id 2 urls !!!!

  /** Converts an array of ids-field to an object w/ ids as keys SUPER DYNAMIC INDEXING
   * @param {redux data}: datatable from redux
   * @param {string}: the tables field you want to parse
   */
export const idsToAny = (dataArray, field) =>
  dataArray.reduce((final, curr) => ({ ...final, [curr._id]: curr[field] }), {}); // <----- id 2 any field !!!!

