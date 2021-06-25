import { Component, h, State } from '@stencil/core';
import { MinimalViewPortConfig } from '../../../utils/dataTypes';

const VIEW_PORT_GROUP = 'some-group';

const NARROW_VIEWPORT: MinimalViewPortConfig = {
  start: new Date(2000, 0, 0),
  end: new Date(2000, 0, 1),
  group: VIEW_PORT_GROUP,
};

const WIDE_VIEWPORT: MinimalViewPortConfig = {
  start: new Date(2000, 0, 0),
  end: new Date(2001, 0, 0),
  group: VIEW_PORT_GROUP,
};

@Component({
  tag: 'line-chart-viewport-change',
})
export class LineChartViewportChange {
  @State() viewPort: MinimalViewPortConfig = NARROW_VIEWPORT;

  toggleViewPort = () => {
    this.viewPort = this.viewPort !== NARROW_VIEWPORT ? NARROW_VIEWPORT : WIDE_VIEWPORT;
  };

  render() {
    return (
      <div>
        <button id="toggle-view-port" onClick={this.toggleViewPort}>
          use {this.viewPort === NARROW_VIEWPORT ? 'wide' : 'narrow'} viewport
        </button>
        <br />
        <br />
        <div id="chart-container" style={{ marginTop: '20px', width: '500px', height: '500px' }}>
          <monitor-line-chart widgetId="widget-id" dataStreams={[]} viewPort={this.viewPort} />
        </div>
        <monitor-webgl-context />
      </div>
    );
  }
}
