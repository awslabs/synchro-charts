describe('scatter chart', () => {
  const root = '/tests/sc-scatter-chart';

  const VIEWPORT_HEIGHT = 500;
  const VIEWPORT_WIDTH = 500;

  beforeEach(() => {
    cy.viewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  });

  it('renders three appended points', () => {
    cy.visit(`${root}/scatter-chart-dynamic-data`);

    cy.get('.data-container').should('be.visible');
    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#add-data-point').click();
    cy.get('#remove-data-point').click();
    cy.get('#add-data-point').click();

    cy.get('#chart-container').matchImageSnapshotOnCI();
  });

  it('correctly renders tooltip with trend line values', () => {
    /**
     * The tooltip should:
     * - render trend line values with a dashed stream icon
     * - render tooltip values in descending order, regardless of data stream or trend line added order
     */

    cy.visit(`${root}/tooltip/multiple-data-streams-and-trends`);

    cy.get('.data-container')
      .should('be.visible')
      .click();

    cy.get('.data-container').trigger('mousemove', { offsetX: VIEWPORT_WIDTH / 3, offsetY: VIEWPORT_HEIGHT / 2 });
    cy.get('.tooltip-container').should('be.visible');
    cy.get('.tooltip-container .bar').should('have.length', 4);
    cy.get('.tooltip-container [data-testid="tooltip-icon-data"]').should('have.length', 2);
    cy.get('.tooltip-container [data-testid="tooltip-icon-trend"]').should('have.length', 2);

    /**
     * The image will show that the black data stream is added before the red one.
     *
     * The image will also show that regardless of the data stream added order, the tooltip will sort and show the
     * data stream and trend line values in a descending order (red data, black trend, red trend, black data).
     */
    cy.matchImageSnapshotOnCI();
  });

  it('correctly renders data stream and trend line information in legend', () => {
    cy.visit(`${root}/trend-line-with-legend`);

    cy.get('.data-container')
      .should('be.visible')
      .click();

    cy.get('.legend-row-container').should('be.visible');
    cy.get('.bar').should('have.length', 2);
    cy.get('.legend-row-container').should('have.length', 2);
    cy.get('[data-testid="legend-icon-trend"]').should('have.length', 1);

    const DATA_STREAM_NAME = 'test stream';
    const DATA_POINT_Y = '3000';
    // Display name of data stream
    cy.get('[data-test-tag="expandable-input"]')
      .eq(0)
      .invoke('text')
      .should('equal', DATA_STREAM_NAME);
    // Display latest value
    cy.get('[data-testid="current-value"]')
      .eq(0)
      .invoke('text')
      .should('equal', DATA_POINT_Y);

    // const TREND_VALUE = '3669.3688';
    // Display trend line label
    cy.get('[data-test-tag="expandable-input"]')
      .eq(1)
      .invoke('text')
      .should('equal', `${DATA_STREAM_NAME} (linear)`);
    // Display latest value
    // cy.get('[data-testid="current-value"]')
    //   .eq(1)
    //   .invoke('text')
    //   .should('equal', TREND_VALUE);

    cy.matchImageSnapshotOnCI();
  });

  it('trend line and icons are the correct color', () => {
    cy.visit(`${root}/trend-line-color-configuration`);

    cy.get('.data-container')
      .should('be.visible')
      .click();

    cy.get('.legend-row-container').should('be.visible');
    cy.get('.bar').should('have.length', 2);
    cy.get('[data-testid="legend-icon-data"]').should('have.length', 1);
    cy.get('[data-testid="legend-icon-trend"]').should('have.length', 1);

    // Correct color for trend line
    cy.get('.linear-regression').should('have.attr', 'stroke', '#123abc');

    // Correct color for legend icon
    cy.get('[data-testid="legend-icon-trend"] path').should('have.attr', 'stroke', '#123abc');

    // Correct color for tooltip icon
    cy.get('.data-container').trigger('mousemove', { offsetX: VIEWPORT_WIDTH / 3, offsetY: VIEWPORT_HEIGHT / 2 });
    cy.get('[data-testid="tooltip-icon-trend"] path').should('have.attr', 'stroke', '#123abc');

    cy.matchImageSnapshotOnCI();
  });
});
