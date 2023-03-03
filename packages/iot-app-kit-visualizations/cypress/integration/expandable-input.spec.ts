const subRoot = '/tests/sc-expandable-input/standard';
it('onValueChange is invoked only after blur', () => {
  cy.visit(subRoot);
  const SOME_TEXT = 'some text';
  cy.get('[data-test-tag="expandable-input"').type(SOME_TEXT);
  // Blur event hasn't occur yet, do not fire event
  cy.get('#input-value').should($span => {
    expect($span).not.to.contain(SOME_TEXT);
  });
  // Click something outside of the input to fire blur event
  cy.get('body').click();
  // Blur even has occured, the onValueChange has then fired, which has caused the
  cy.get('#input-value').should($span => {
    expect($span).to.contain(SOME_TEXT);
  });
});
