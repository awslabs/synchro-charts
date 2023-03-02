import { DRAGGABLE_HANDLE_SELECTOR } from '../../../src/components/charts/common/annotations/YAnnotations/YAnnotations';

it('correctly handles dragging annotations when multiple charts share a reference to the same annotation', () => {
  cy.visit('http://localhost:3333/tests/sc-webgl-chart/annotations/draggable-multi');
  cy.viewport(1000, 1000);
  cy.waitForChart();

  cy.window().then(win => {
    // Move annotation-1 on the first chart
    cy.get(DRAGGABLE_HANDLE_SELECTOR)
      .first()
      .trigger('mousedown', { which: 1, button: 0, force: true, view: win })
      .trigger('mousemove', { clientX: 0, clientY: -100, force: true, view: win })
      .trigger('mouseup', { view: win });

    cy.get(DRAGGABLE_HANDLE_SELECTOR)
      .last()
      .trigger('mousedown', { which: 1, button: 0, force: true, view: win })
      .trigger('mousemove', { clientX: 0, clientY: -100, force: true, view: win })
      .trigger('mouseup', { view: win });
  });

  cy.get(DRAGGABLE_HANDLE_SELECTOR)
    .first()
    .then($div => {
      const firstAnnotationsValue = $div
        .parent()
        .find('.y-value-text')
        .get(0).textContent as string;
      cy.get('sc-line-chart')
        .last()
        .contains(firstAnnotationsValue)
        .should('not.exist');
    });
});
