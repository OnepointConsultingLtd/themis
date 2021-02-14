/* eslint-disable key-spacing */
const API = {
  config: {
    read:   '/api/config/load', // :branch
    create: '/api/config/create', // :branch
    update: '/api/config/update', // :branch/:id
    delete: '/api/config/delete', // :branch/:id
  },
  rules: {
    read:           '/api/rules/load',
    create:         '/api/rules/import',
    createVersion:  '/api/rules/clone', // :id
    updateRule:     '/api/rules/update-rule', // :id
    updateVersion:  '/api/rules/update-version', // :id/:version
    delete:         '/api/rules/delete', // :id
    bulkDeactivate: '/api/rules/bulk/deactivate',
    bulkActivate:   '/api/rules/bulk/activate',
    bulkDelete:     '/api/rules/bulk/delete',
    bulkUpdateTags: '/api/rules/bulk/update/tags'
  }
};

export default API;
