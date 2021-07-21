export function moveHandle(selector: string, x: number, y: number) {
  cy.window().then(win => {
    cy.get(selector).trigger('mousedown', { which: 1, button: 0, force: true, view: win });
    cy.get(selector)
      .trigger('mousemove', { clientX: x, clientY: y, force: true, view: win })
      .trigger('mouseup', { force: true, view: win });
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
  });
}

export function moveHandlWithPause(selector: string, x: number, y: number) {
  cy.window().then(win => {
    cy.get(selector).trigger('mousedown', { which: 1, button: 0, force: true, view: win });
    cy.get(selector)
      .trigger('mousemove', { clientX: x, clientY: y, force: true, view: win })
      .wait(500);
  });
}
