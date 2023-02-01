import { Component, h } from '@stencil/core';
import { routes } from '../app/routes';

@Component({
  tag: 'testing-ground',
})
export class testingGrounds {
  render() {
    return (
      <div>
        <h3>
          hello, welcome to the{' '}
          <a href="https://synchrocharts.com/" rel="noopener noreferrer" target="_blank">
            synchro-charts
          </a>{' '}
          testing grounds!
        </h3>
        <h4>check out our demo components:</h4>

        {routes.map(route => (
          <div>
            {' '}
            <a href={route.url}>{route.component}</a>{' '}
          </div>
        ))}
      </div>
    );
  }
}
