/* eslint-disable jsx-a11y/label-has-associated-control */

import { Component, h, State } from '@stencil/core';
import { DataPoint } from '../../../utils/dataTypes';
import { DataType } from '../../../utils/dataConstants';

// viewport boundaries
const Y_MIN = 0;
const Y_MAX = 5000;

const X_MIN = new Date(1998, 0, 0);
const X_MAX = new Date(2001, 0, 1);

const TEST_DATA_POINT: DataPoint<number> = {
  x: new Date(2001, 0, 0).getTime(),
  y: 0,
};

const TEST_DATA_POINT_2: DataPoint<number> = {
  x: new Date(2001, 0, 0).getTime(),
  y: 4000,
};

const TEST_2DATA_POINT: DataPoint<number> = {
  x: new Date(1998, 0, 0).getTime(),
  y: 0,
};

const TEST_2DATA_POINT_2: DataPoint<number> = {
  x: new Date(1998, 0, 0).getTime(),
  y: 4000,
};

const TOOLBAR_HEIGHT = 30;
const SIDE_PANEL_WIDTH = 30;
const FULL_WIDTH_PX = '100vw';
const FULL_HEIGHT_PX = '100vh';
const TOOLBAR_HEIGHT_PX = `${TOOLBAR_HEIGHT}px`;
const SIDE_PANEL_WIDTH_PX = `${SIDE_PANEL_WIDTH}px`;
const BODY_HEIGHT_PX = `calc(${FULL_HEIGHT_PX} - ${TOOLBAR_HEIGHT_PX})`;

type ContextPlacement = 'viewport' | 'element';

/**
 * Testing route for the webGL rendering without being fully coupled to the chart.
 *
 * Tests that a single point renders as a circle correctly
 */

@Component({
  tag: 'iot-app-kit-vis-webgl-context-nested',
})
export class ScWebglContextNested {
  @State() elementRef?: HTMLDivElement;
  @State() selectList?: HTMLSelectElement;
  @State() contextPlacement: ContextPlacement = 'viewport';

  render() {
    const chart = (x: number, y: number) => (
      <div
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          height: '500px',
          width: '500px',
        }}
      >
        <iot-app-kit-vis-line-chart
          widgetId={`${x + y}id`}
          dataStreams={[
            {
              id: 'test',
              color: 'black',
              name: 'test stream',
              data: [TEST_2DATA_POINT, TEST_2DATA_POINT_2, TEST_DATA_POINT, TEST_DATA_POINT_2],
              resolution: 0,
              dataType: DataType.NUMBER,
            },
          ]}
          viewport={{ start: X_MIN, end: X_MAX, yMin: Y_MIN, yMax: Y_MAX }}
          setViewport={() => {}}
        />
      </div>
    );
    const selectOption = (o: ContextPlacement) => (
      <option value={o} selected={o === this.contextPlacement}>
        {o}
      </option>
    );
    const toolbar = (
      <div style={{ height: TOOLBAR_HEIGHT_PX, width: FULL_WIDTH_PX, borderBottom: '1px solid black' }}>
        <label htmlFor="context">Select context placement:</label>
        <select
          id="context"
          name="context"
          ref={el => {
            this.selectList = el;
          }}
          onChange={() => {
            this.contextPlacement = this.selectList?.value as ContextPlacement;
          }}
        >
          {selectOption('viewport')}
          {selectOption('element')}
        </select>
      </div>
    );
    const sidePanel = (
      <div
        style={{
          width: SIDE_PANEL_WIDTH_PX,
          background: 'white',
          position: 'relative',
          resize: 'horizontal',
          overflow: 'auto',
        }}
      >
        Resizeable Side Panel
      </div>
    );

    return (
      <div
        style={{
          height: FULL_HEIGHT_PX,
          width: FULL_WIDTH_PX,
        }}
        key={this.contextPlacement}
      >
        {toolbar}
        <div
          style={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'max-content auto max-content',
            gridGap: '1px',
            background: 'black',
            height: BODY_HEIGHT_PX,
          }}
        >
          {sidePanel}
          <div
            style={{
              overflow: 'scroll',
              position: 'relative',
              height: '100%',
              width: '100%',
              background: 'white',
            }}
            ref={el => {
              this.elementRef = el;
            }}
          >
            <div>
              <div>
                <div>
                  <div
                    style={{
                      position: 'absolute',
                      height: '2000px',
                      width: '2000px',
                    }}
                  >
                    {chart(0, 0)}
                    {chart(500, 500)}
                    {chart(1000, 1000)}
                  </div>
                </div>
                <div />
              </div>
              {this.contextPlacement === 'element' && <iot-app-kit-vis-webgl-context viewFrame={this.elementRef} />}
            </div>
          </div>
          {sidePanel}
        </div>
        {this.contextPlacement === 'viewport' && <iot-app-kit-vis-webgl-context />}
      </div>
    );
  }
}
