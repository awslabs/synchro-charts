import { SECOND_IN_MS } from '../../src/utils/time';

const root = '/tests/webgl-chart';

const addChartToFront = (cy: Cypress.cy) => {
  cy.get('#add-chart-to-front').click();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addChartToBack = (cy: Cypress.cy) => {
  cy.get('#add-chart-to-back').click();
};

const shiftRight = (cy: Cypress.cy) => {
  cy.get('#shift-right').click();
  cy.wait(0.5 * SECOND_IN_MS);
};

const shiftLeft = (cy: Cypress.cy) => {
  cy.get('#shift-left').click();
  cy.wait(0.5 * SECOND_IN_MS);
};

const removeChartFromBack = (cy: Cypress.cy) => {
  cy.get('#remove-chart-from-back').click();
};

const removeChartFromFront = (cy: Cypress.cy) => {
  cy.get('#remove-chart-from-front').click();
};

it('renders data on canvas', () => {
  cy.visit(`${root}/webgl-chart-dynamic-charts`);
  addChartToFront(cy);
  cy.get('.data-container').should('be.visible');

  cy.matchImageSnapshotOnCI();
});

it('shifts visualized data to the right', () => {
  cy.visit(`${root}/webgl-chart-dynamic-charts`);
  addChartToFront(cy);
  cy.get('.data-container').should('be.visible');
  shiftRight(cy);

  cy.wait(0.5 * SECOND_IN_MS);

  cy.matchImageSnapshotOnCI();
});

it('shifts visualized data to the left', () => {
  cy.visit(`${root}/webgl-chart-dynamic-charts`);
  addChartToFront(cy);
  cy.get('.data-container').should('be.visible');
  shiftRight(cy);
  shiftLeft(cy);

  cy.wait(0.5 * SECOND_IN_MS);

  cy.matchImageSnapshotOnCI();
});

it('clears canvas when a single chart is unmounted', () => {
  cy.visit(`${root}/webgl-chart-dynamic-charts`);
  addChartToFront(cy);
  cy.get('.data-container').should('be.visible');
  removeChartFromFront(cy);
  cy.get('.data-container').should('not.exist');

  cy.wait(0.5 * SECOND_IN_MS);

  cy.matchImageSnapshotOnCI();
});

it('with two charts, removing the back chart should clean up the canvas', () => {
  cy.visit(`${root}/webgl-chart-dynamic-charts`);
  addChartToFront(cy);
  addChartToFront(cy);
  cy.get('.data-container').should('be.visible');
  removeChartFromBack(cy);

  cy.wait(0.5 * SECOND_IN_MS);

  cy.matchImageSnapshotOnCI();
});

it('with two charts, removing the front chart should clean up the canvas', () => {
  cy.visit(`${root}/webgl-chart-dynamic-charts`);
  addChartToFront(cy);
  addChartToFront(cy);
  cy.get('.data-container').should('be.visible');
  removeChartFromFront(cy);

  cy.wait(0.5 * SECOND_IN_MS);

  cy.matchImageSnapshotOnCI();
});
