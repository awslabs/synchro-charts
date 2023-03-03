import { h } from '@stencil/core';

import { Arrow } from './Arrow';

import { DataPoint } from '../../../utils/dataTypes';

const enum TrendDirection {
  Down = 'Down',
  Flat = 'Flat',
  None = 'None',
  Up = 'Up',
}

const getStreamDirection = (curr: number | undefined, prev: number | undefined): TrendDirection => {
  if (curr == null || prev == null) {
    return TrendDirection.None;
  }
  if (curr === prev) {
    return TrendDirection.Flat;
  }
  return curr > prev ? TrendDirection.Up : TrendDirection.Down;
};

const computePercentage = (prevValue: number, currValue: number): string | undefined => {
  if (currValue === prevValue) {
    return '0%';
  }
  if (prevValue === 0) {
    // Do not percentage if 'infinite' change
    return undefined;
  }

  const decimal = currValue / prevValue;
  const percentage = ((decimal - 1) * 100).toFixed(1);
  const absoluteValue = parseFloat(percentage) > 0 ? percentage : parseFloat(percentage) * -1;
  return `${absoluteValue}%`;
};

export const Trend = ({
  previousPoint: { y: prevY },
  latestPoint: { y: latestY },
  miniVersion,
}: {
  previousPoint: DataPoint<number>;
  latestPoint: DataPoint<number>;
  miniVersion: boolean;
}) => {
  const direction = getStreamDirection(latestY, prevY);
  const classes = {
    trend: true,
    large: !miniVersion,
    down: direction === TrendDirection.Down,
    flat: direction === TrendDirection.Flat,
    up: direction === TrendDirection.Up,
  };
  return (
    <div class={classes}>
      <div class="data">
        <div class="direction">
          <Arrow />
        </div>
        <div data-testid="previous-value" class="value">
          {computePercentage(prevY, latestY)}
        </div>
      </div>
      {!miniVersion && <div class="trend-description">from previous value</div>}
    </div>
  );
};
