import { STATUS_TIMELINE_OVERLAY_SELECTOR, waitForChart, waitForDataError } from '../../src/testing/selectors';

const defaultSnapshotOptions = {
  failureThreshold: 1.2,
  failureThresholdType: 'percent',
};

export const addChartCommands = () => {
  Cypress.Commands.add('waitForChart', () => waitForChart(cy));
  Cypress.Commands.add('waitForDataError', () => waitForDataError(cy));

  Cypress.Commands.add('waitForStatusTimeline', () => {
    waitForChart(cy);
    cy.get(`${STATUS_TIMELINE_OVERLAY_SELECTOR} > *`).should('be.visible');
  });

  Cypress.Commands.add(
    'matchImageSnapshotOnCI',
    { prevSubject: 'optional' },
    (subject, nameOrOptions?: string | Object) => {
      if (!Cypress.env('disableSnapshotTests')) {
        if (subject) {
          cy.wrap(subject).matchImageSnapshot(nameOrOptions || defaultSnapshotOptions);
        } else {
          cy.matchImageSnapshot(nameOrOptions || defaultSnapshotOptions);
        }
      }
    }
  );
};
