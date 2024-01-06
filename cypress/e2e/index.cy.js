/// <reference types="cypress" />

describe('Project website submodule', () => {
  before(() => {
    cy.visit('http://localhost:8080/');
  });
  it('should show more (...) dropdown', () => {
    cy.get('.mui-panel:not(.mui--hide) [data-mui-toggle="dropdown"]')
      .first()
      .as('dropdown');
    cy.get('@dropdown').should('be.visible');
    cy.get('@dropdown')
      .first()
      // eslint-disable-next-line no-underscore-dangle
      .should(($button) => expect($button[0]._muiRipple).to.be.true);
    cy.get('@dropdown').click();
    cy.get('@dropdown').next().find('.more-cover').should('be.visible');
    cy.get('@dropdown').next().find('.more-link').should('be.visible');
  });
  it('should load iframes', () => {
    cy.get('.mui-panel:not(.mui--hide)').as('panel');
    cy.get('@panel').eq(2).scrollIntoView();
    cy.get('@panel')
      .eq(2)
      .find('iframe')
      .its('0.contentDocument')
      .should('exist');
  });
  it('should load video', () => {
    cy.get('.yt').as('video');
    cy.get('@video').first().scrollIntoView();
    cy.get('@video').next('iframe').its('0.contentDocument').should('exist');
  });
  it('should show hidden panel', () => {
    cy.get('#hiddenAlbum.mui--hide').as('hiddenPanel');
    cy.get('@hiddenPanel').should('not.be.visible');
    cy.get('[aria-label="Show hidden panel"]').focus();
    cy.get('[aria-label="Show hidden panel"]').click();
    cy.get('@hiddenPanel').should('not.exist');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('#hiddenAlbum').then(($hiddenAlbum) => {
      const hiddenAlbum = $hiddenAlbum[0];
      console.log(hiddenAlbum);
      expect(hiddenAlbum.getClientRects()[0].top).greaterThan(79).lessThan(100);
    });
  });
  it('should reload', () => {
    cy.visit('http://localhost:8080/');
  });
});
