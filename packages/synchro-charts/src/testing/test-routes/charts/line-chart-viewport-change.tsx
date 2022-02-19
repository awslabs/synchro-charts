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

const FIVE_MINUTE_VIEWPORT: MinimalViewPortConfig = {
  duration: '5m',
};

const THIRTY_MINUTE_VIEWPORT: MinimalViewPortConfig = {
  duration: '30m',
};

@Component({
  tag: 'line-chart-viewport-change',
})
export class LineChartViewportChange {
  @State() viewport: MinimalViewPortConfig = NARROW_VIEWPORT;

  setViewPort = viewport => {
    this.viewport = viewport;
  };

  render() {
    return (
      <div class="synchro-chart-tests">
        <button id="toggle-narrow-view-port" onClick={() => this.setViewPort(NARROW_VIEWPORT)}>
          use narrow viewport
        </button>
        <button id="toggle-wide-view-port" onClick={() => this.setViewPort(WIDE_VIEWPORT)}>
          use wide viewport
        </button>
        <button id="toggle-five-minute-view-port" onClick={() => this.setViewPort(FIVE_MINUTE_VIEWPORT)}>
          use 5 minute viewport
        </button>
        <button id="toggle-thirty-moinute-view-port" onClick={() => this.setViewPort(THIRTY_MINUTE_VIEWPORT)}>
          use 30 minute viewport
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
