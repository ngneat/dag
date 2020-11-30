describe('Demo Homepage', () => {
  beforeEach(() => cy.visit('/demo'));

  it('should have an item on the page when it first loads', () => {
    cy.get('ngneat-dag-node').should('have.length', 1);
  });

  it('should add one child to the main node', () => {
    cy.get('ngneat-dag-node')
      .eq(0)
      .then(() => {
        cy.get('select').select('1');
        cy.get('[data-cy=add-children-button]').click();
        cy.get('ngneat-dag-node').should('have.length', 2);
      });
  });

  it('should add one child to the main node and then remove the child', () => {
    cy.get('ngneat-dag-node')
      .eq(0)
      .then(() => {
        cy.get('select').select('1');
        cy.get('[data-cy=add-children-button]').click();
        cy.get('ngneat-dag-node').should('have.length', 2);
        cy.get('ngneat-dag-node [data-cy=remove-node-button]').eq(1).click();
        cy.get('ngneat-dag-node')
          .should('have.length', 1)
          .and('include.text', 'Step 1');
      });
  });

  it('should add two children to the main node', () => {
    cy.get('ngneat-dag-node')
      .eq(0)
      .then(() => {
        cy.get('select').select('2');
        cy.get('[data-cy=add-children-button]').click();
        cy.get('ngneat-dag-node').should('have.length', 3);
      });
  });

  it('should add two children to the main node and rearrange node 2 to the top when node 1 is removed', () => {
    cy.get('ngneat-dag-node')
      .eq(0)
      .then(() => {
        cy.get('select').select('2');
        cy.get('[data-cy=add-children-button]').click();
        cy.get('ngneat-dag-node').should('have.length', 3);
        cy.get('[data-cy=remove-node-button]').eq(0).click();
        cy.get('ngneat-dag-node')
          .should('have.length', 1)
          .and('include.text', 'Step 2');
      });
  });
});
