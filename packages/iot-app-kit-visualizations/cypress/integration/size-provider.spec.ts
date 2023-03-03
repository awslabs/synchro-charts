import { DEFAULT_SIZE, SHIFT_X_DIFF } from '../../src/testing/test-routes/sc-size-provider/constants';
import { SECOND_IN_MS } from '../../src/utils/time';

const root = '/tests/sc-sizer-provider/sc-size-provider-standard';

it('child of widget sizer inherits size-providers parent size', () => {
  cy.visit(root);
  cy.get('sc-box > .box-container')
    .should('be.visible')
    .should($el => {
      expect($el).to.have.css('width', `${DEFAULT_SIZE.width}px`);
      expect($el).to.have.css('height', `${DEFAULT_SIZE.height}px`);
    });
});

it('on update of the size-providers parent size, the child of widget sizer has its size updated', () => {
  const UPDATED_WIDTH = 9000;
  const UPDATED_HEIGHT = 8000;

  cy.visit(root);
  cy.get('sc-box > .box-container').should('be.visible');

  cy.get('#container').then(div => {
    div.css('width', `${UPDATED_WIDTH}px`);
    div.css('height', `${UPDATED_HEIGHT}px`);
  });

  cy.get('sc-box > .box-container').should($el => {
    expect($el).to.have.css('width', `${UPDATED_WIDTH}px`);
    expect($el).to.have.css('height', `${UPDATED_HEIGHT}px`);
  });
});

it('the position of the component is accurately set on initial render', () => {
  cy.visit(root);
  cy.get('sc-box > .box-container').should('be.visible');

  let INITIAL_RECT: DOMRect;
  cy.get('sc-box > .box-container')
    .should('be.visible')
    .get('sc-box')
    .then(el => {
      INITIAL_RECT = el[0].getBoundingClientRect();
    });

  cy.get('sc-box > .box-container').should($el => {
    expect($el).to.have.attr('data-x', INITIAL_RECT.x.toString());
    expect($el).to.have.attr('data-y', INITIAL_RECT.y.toString());
    expect($el).to.have.attr('data-left', INITIAL_RECT.left.toString());
    expect($el).to.have.attr('data-right', INITIAL_RECT.right.toString());
    expect($el).to.have.attr('data-top', INITIAL_RECT.top.toString());
    expect($el).to.have.attr('data-width', INITIAL_RECT.width.toString());
    expect($el).to.have.attr('data-height', INITIAL_RECT.height.toString());
    expect($el).to.have.attr('data-width', DEFAULT_SIZE.width.toString());
    expect($el).to.have.attr('data-height', DEFAULT_SIZE.height.toString());
  });
});

it('the position of the component is unchanged by scrolling vertically', () => {
  cy.visit(root);
  cy.viewport(700, 700);

  let INITIAL_RECT: DOMRect;
  cy.get('sc-box > .box-container')
    .should('be.visible')
    .get('sc-box')
    .then(el => {
      INITIAL_RECT = el[0].getBoundingClientRect();
    });

  cy.scrollTo('bottom');

  cy.wait(0.5 * SECOND_IN_MS)
    .get('sc-box > .box-container')
    .should($el => {
      expect($el).to.have.attr('data-x', INITIAL_RECT.x.toString());
      expect($el).to.have.attr('data-y', INITIAL_RECT.y.toString());
      expect($el).to.have.attr('data-left', INITIAL_RECT.left.toString());
      expect($el).to.have.attr('data-right', INITIAL_RECT.right.toString());
      expect($el).to.have.attr('data-top', INITIAL_RECT.top.toString());
      expect($el).to.have.attr('data-width', INITIAL_RECT.width.toString());
      expect($el).to.have.attr('data-height', INITIAL_RECT.height.toString());
    });
});

it('the position of the component is unchanged by scrolling horizontally', () => {
  cy.visit(root);
  cy.viewport(700, 700);

  let INITIAL_RECT: DOMRect;
  cy.get('sc-box > .box-container')
    .should('be.visible')
    .get('sc-box')
    .then(el => {
      INITIAL_RECT = el[0].getBoundingClientRect();
    });

  cy.scrollTo('right');

  cy.wait(0.5 * SECOND_IN_MS)
    .get('sc-box > .box-container')
    .should($el => {
      expect($el).to.have.attr('data-x', INITIAL_RECT.x.toString());
      expect($el).to.have.attr('data-y', INITIAL_RECT.y.toString());
      expect($el).to.have.attr('data-left', INITIAL_RECT.left.toString());
      expect($el).to.have.attr('data-right', INITIAL_RECT.right.toString());
      expect($el).to.have.attr('data-top', INITIAL_RECT.top.toString());
      expect($el).to.have.attr('data-width', INITIAL_RECT.width.toString());
      expect($el).to.have.attr('data-height', INITIAL_RECT.height.toString());
    });
});

it('the position of the component is updated after being shifted', () => {
  cy.visit(root);

  let INITIAL_RECT: DOMRect;
  cy.get('sc-box > .box-container')
    .should('be.visible')
    .get('sc-box')
    .then(el => {
      INITIAL_RECT = el[0].getBoundingClientRect();
    });

  cy.get('#shift-right').click();

  cy.wait(0.5 * SECOND_IN_MS)
    .get('sc-box > .box-container')
    .should($el => {
      expect($el).to.have.attr('data-x', (INITIAL_RECT.x + SHIFT_X_DIFF).toString());
      expect($el).to.have.attr('data-y', INITIAL_RECT.y.toString());
      expect($el).to.have.attr('data-left', (INITIAL_RECT.left + SHIFT_X_DIFF).toString());
      expect($el).to.have.attr('data-right', (INITIAL_RECT.right + SHIFT_X_DIFF).toString());
      expect($el).to.have.attr('data-top', INITIAL_RECT.top.toString());
      expect($el).to.have.attr('data-width', INITIAL_RECT.width.toString());
      expect($el).to.have.attr('data-height', INITIAL_RECT.height.toString());
    });
});
