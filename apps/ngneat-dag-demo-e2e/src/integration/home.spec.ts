describe('Demo Homepage', () => {
  beforeEach(() => cy.visit('/'));

  it('should have the library description and action buttons', () => {
    cy.get('[data-cy=library-description]').should('have.length', 1);
    cy.get('[data-cy=cta-links] a').should('have.length', 2);
    cy.get('[data-cy=cta-links] a').eq(0).should('include.text', 'View Docs');
    cy.get('[data-cy=cta-links] a').eq(1).should('include.text', 'Live Demo');
  });
});
