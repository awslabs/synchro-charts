/// <reference types="cypress" />

import { SECOND_IN_MS } from '../../../src/utils/time';
import { FOCUS_TRANSITION_TIME } from '../../../src/components/charts/common/annotations/draggableAnnotations';

export function moveHandle(selector: string, x: number, y: number) {
  cy.window().then(win => {
    cy.get(selector).trigger('mousedown', { which: 1, button: 0, force: true, view: win });
    cy.get(selector)
      .trigger('mousemove', { clientX: x, clientY: y, force: true, view: win })
      .trigger('mouseup', { force: true, view: win });
    cy.wait(2 * FOCUS_TRANSITION_TIME);
  });
}

export function moveHandleFilter(selector: string, filter: string, x: number, y: number) {
  cy.window().then(win => {
    cy.get(selector)
      .filter(filter)
      .trigger('mousedown', { which: 1, button: 0, force: true, view: win });
    cy.get(selector)
      .filter(filter)
      .trigger('mousemove', { clientX: x, clientY: y, force: true, view: win })
      .trigger('mouseup', { force: true, view: win });
    cy.wait(2 * FOCUS_TRANSITION_TIME);
  });
}

export function moveHandleWithPause(selector: string, x: number, y: number) {
  cy.window().then(win => {
    cy.get(selector).trigger('mousedown', { which: 1, button: 0, force: true, view: win });
    cy.get(selector)
      .trigger('mousemove', { clientX: x, clientY: y, force: true, view: win })
      .wait(SECOND_IN_MS);
  });
}

export const parseTransformYValue = (transformValue: string): number => {
  const digits = transformValue.indexOf(')') - transformValue.indexOf(',') - 1;
  const yValue = transformValue.substr(transformValue.indexOf(',') + 1, digits);
  return +yValue;
};
