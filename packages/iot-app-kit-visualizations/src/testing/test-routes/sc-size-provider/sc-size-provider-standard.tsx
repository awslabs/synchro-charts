import { Component, h, State } from '@stencil/core';
import { DEFAULT_SIZE, SHIFT_X_DIFF } from './constants';

@Component({
  tag: 'iot-app-kit-vis-size-provider-standard',
})
export class ScSizeProviderStandard {
  @State() marginLeft: number = 0;

  onShiftRight = () => {
    this.marginLeft += SHIFT_X_DIFF;
  };

  render() {
    return (
      <div class="synchro-chart-tests" style={{ width: '2000px', height: '2000px' }}>
        <div>
          <button id="shift-right" onClick={this.onShiftRight}>
            Shift Right
          </button>
        </div>
        <div
          id="container"
          style={{
            marginLeft: `${this.marginLeft}px`,
            height: `${DEFAULT_SIZE.height}px`,
            width: `${DEFAULT_SIZE.width}px`,
          }}
        >
          <iot-app-kit-vis-size-provider renderFunc={size => <iot-app-kit-vis-box someObject={size} size={size} />} />
        </div>
      </div>
    );
  }
}
