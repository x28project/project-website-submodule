/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  require('@cypress/code-coverage/task')(on, config);

  return config;
};
