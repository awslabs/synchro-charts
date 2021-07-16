import { Component, h, State } from '@stencil/core';
import { MinimalViewPortConfig } from '../../../utils/dataTypes';

const VIEWPORT_GROUP = 'some-group';

const NARROW_VIEWPORT: MinimalViewPortConfig = {
  start: new Date(2000, 0, 0),
  end: new Date(2000, 0, 1),
  group: VIEWPORT_GROUP,
};

const WIDE_VIEWPORT: MinimalViewPortConfig = {
  start: new Date(2000, 0, 0),
  end: new Date(2001, 0, 0),
  group: VIEWPORT_GROUP,
};

@Component({
  tag: 'line-chart-viewport-change',
})
export class LineChartViewportChange {
  @State() viewport: MinimalViewPortConfig = NARROW_VIEWPORT;

  toggleViewPort = () => {
    this.viewport = this.viewport !== NARROW_VIEWPORT ? NARROW_VIEWPORT : WIDE_VIEWPORT;
  };

  render() {
    return (
      <div>
        <button id="toggle-view-port" onClick={this.toggleViewPort}>
          use {this.viewport === NARROW_VIEWPORT ? 'wide' : 'narrow'} viewport
        </button>
        <br />
        <br />
        <div id="chart-container" style={{ marginTop: '20px', width: '500px', height: '500px' }}>
          <sc-line-chart widgetId="widget-id" dataStreams={[]} viewport={this.viewport} />
        </div>
        <sc-webgl-context />
      </div>
    );
  }
}
