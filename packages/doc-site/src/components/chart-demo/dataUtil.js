import { DAY_IN_MS } from "./dateUtil";
import { DataType } from "@synchro-charts/core";

export const getY = (x, duration) =>
  Math.sin(x / (duration * 8)) * 15 +
  (Math.random() * 3) ** 2 +
  Math.log(x) +
  100 +
  Math.random() / 10 +
  Math.random() / 100 +
  Math.random() / 1000;

export const getYby = (x, duration) =>
  Math.sin(x / (duration * 3)) * 15;

export const truncateDate = (num) => Math.floor(num / DAY_IN_MS) * DAY_IN_MS;

const DATA_STREAM_ID_WITH_STRING = 'some-id-3';

export const getRandomData = ({
  start,
  end,
  streamId,
  resolution,
}) => {
  let xMs = truncateDate(start.getTime());
  const dataPoints = [];

  while (xMs <= end.getTime()) {
    xMs += resolution;
    if (Math.random() >= 0.1) {
      const y = getY(xMs, resolution);
      dataPoints.push({
        x: truncateDate(xMs),
        y,
      });
    }
  }

  return {
    id: streamId,
    name: streamId,
    resolution,
    aggregationType: resolution !== 0 ? 'AVERAGE' : undefined,
    data: [],
    aggregates: {
      [resolution]: dataPoints,
    },
    dataType: streamId === DATA_STREAM_ID_WITH_STRING ? DataType.STRING : DataType.NUMBER,
  };
};
