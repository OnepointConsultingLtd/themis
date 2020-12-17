export const serversConfigSchema = [
    {
      name: 'id',
      label: 'Id',
      type: 'static',
      initialValue: '',
      width: 'auto',
      hidden: true
    },
    {
      name: 'label',
      label: 'Label',
      type: 'text',
      initialValue: '',
      width: '100',
      hidden: false
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      initialValue: '',
      width: '600',
      hidden: false
    },
    {
      name: 'edited',
      label: '',
      type: 'static',
      initialValue: '',
      hidden: true
    }, {
      name: 'action', // This schema helper needs revising. If we have more acions?
      label: '', //        what if we want to declare the actions here?
      type: 'static',
      initialValue: '',
      width: '100',
      hidden: false
    },
  ];
  
  export const tagsConfigSchema = [
    {
      name: 'id',
      label: 'Id',
      type: 'static',
      initialValue: '',
      width: 'auto',
      hidden: true
    },
    {
      name: 'label',
      label: 'Tag',
      type: 'text',
      initialValue: '',
      width: '10',
      hidden: false
    },
    {
      name: 'edited',
      label: '',
      type: 'static',
      initialValue: '',
      hidden: true
    }, {
      name: 'action', // This schema helper needs revising. If we have more acions?
      label: '', //        what if we want to declare the actions here?
      type: 'static',
      initialValue: '',
      width: '100',
      hidden: false
    },
  ];
  
  export const generatorsConfigSchema = [
    {
      name: 'id',
      label: 'Id',
      type: 'static',
      initialValue: '',
      width: 'auto',
      hidden: true
    },
    {
      name: 'label',
      label: 'Name',
      type: 'text',
      initialValue: '',
      width: '100',
      hidden: false
    },
    {
      name: 'tags',
      label: 'Related tags',
      type: 'redux-multiselection', // new type: dynamic multi-selector drawing data from redux store
      reduxBranch: 'TagsConfig', // define the branch that options will draw data from
      reduxDataTable: 'dataTable', // which specific redux-table ?
      reduxField: 'label', // selection options will include all the labels from TagsConfig table
      initialValue: ['NA'],
      width: '300',
      hidden: false
    },
    {
      name: 'filterLogic',
      label: 'Filter Logic',
      type: 'selection',
      initialValue: 'Exact match',
      options: ['Exact match', 'Match all', 'Match any'],
      width: '150',
      hidden: false
    },
    {
      name: 'edited',
      label: '',
      type: 'static',
      initialValue: '',
      hidden: true
    }, {
      name: 'action', // This schema helper needs revising. If we have more acions?
      label: '', //        what if we want to declare the actions here?
      type: 'static',
      initialValue: '',
      width: '100',
      hidden: false
    },
  ];
  
    /**
     * Rules aggregation
     * @param {object[]} rulesArray
     * @returns {object[]} an array of aggregated objects
     */
  export const aggregateRules = (rulesArray) =>
  // console.log('This is going to be aggregated: ', rule.versions.map(version => (version.servers !== 'NA' ? version.servers : '')));
    rulesArray.map(
      rule => ({
        _id: rule._id,
        name: rule.name,
        tags: rule.tags,
        servers: rule.versions.map(version => (version.servers !== 'NA' ? version.servers : [])).flat(1),
        active: rule.active
      }));
  export const aggregateServerReturnContent = (versionsArray, server) =>
    (versionsArray
      .filter(x => x.servers.includes(server)) // match specific selected server
      .map(version => version.content)
      .join('\n\n'));
  
    /**
     * Takes the rules array and aggregates all the deployed versions sub-records (deep-flatten rules array)
     * @param {object[]} rulesArray
     * @param {string[]} tags Tags id's
     * @param {string} filterLogic Tags filter logic: 'Exact match' ||  'Match all' || 'Match any'
     * @param {string[]} allTags The active tags as declared in Tags Config page
     * @returns {object[]} an array of aggregated objects
     */
  export const aggregateAllActiveDeployedVersions = (rulesArray, pinnedTags, filterLogic, allTags) => rulesArray
  // select only the active ones
    .filter(x => x.active)
  // Debugged:  making sure that selected-tags are ALL included in the rules tags (not the other ways around)
  // (there were left overs of deleted tags inside tags-list inside versions, that was blocking the filtering)
    .filter(ruleItem => {
      const cleanedVersionTags = ruleItem.tags.filter(tag => allTags.includes(tag));
      if (cleanedVersionTags.length > 0) { // be carefull, empty tags was bypassing the filters...
        switch (filterLogic) {
          case 'Exact match': { // rules that include all of the pinned tags and ONLY these: mind the deleted tags
            return cleanedVersionTags.every(versionTag => pinnedTags.includes(versionTag) && pinnedTags.length === cleanedVersionTags.length);
          }
          case 'Match all': // rules that include all of the pinned tags but extra ones also
            return pinnedTags.every(pinnedTag => ruleItem.tags.includes(pinnedTag));
          case 'Match any': // rules that include some of the pinned tags
            return cleanedVersionTags.some(versionTag => pinnedTags.includes(versionTag));
          default:
            return false;
        }
      } else { return false; } // dont bother for rules that dont have any tags
    })
  // move rule.id deeper in each deployed version item (because version object does not carry rule ID!)
    .map((rule) => ({
      versions: rule.versions
        .filter(x => !x.servers.includes('NA')) // filter-out all non-deployed
        .map(item => ({
          _id: rule._id, name: rule.name, tags: rule.tags, ...item
        }))
    }))
  // concatenate all versions of all rules into one shallow array
    .flatMap(x => x.versions)
  // and sort them by descending salience and name-alphabetically amongst equal saliences
    .sort((a, b) => b.salience - a.salience || a.name.localeCompare(b.name));
  
    // export const findLockedRules = (rulesArray) => {
    //   return rulesArray.reduce(
    //     (final, curr, i) => {
    //       if (curr.locked) {
    //         return [...final, i];
    //       }
    //       return [...final];
    //     }, []);
    // };
  
    /** Compose a 2 nodes object that contains both locked and deactivated row-indices arrays */
  export const findLockedAndDeactivatedRules = (rulesArray) => rulesArray.reduce(
    (final, curr, i) => {
      if (curr.locked) {
        return {
          lockedRows: [...final.lockedRows, i],
          deactivatedRows: [...final.deactivatedRows]
        };
      }
      if (!curr.active) {
        return {
          lockedRows: [...final.lockedRows],
          deactivatedRows: [...final.deactivatedRows, i]
        };
      }
      return { ...final };
    }, {
      lockedRows: [],
      deactivatedRows: []
    });
  
    /**
       * Fetch single rule based on ID (single rule query)
       * @param {array} rulesArray
       * @param {string} ruleID
       */
  export const fetchRuleFullDetails = (rulesArray, ruleID) =>
    rulesArray.filter(
      rule => rule._id === ruleID
    )[0]; // match RuleID but dont return as array. Return single object
  