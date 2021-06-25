import { getTrendLabel } from '../common/trends/trendConfig';
import { getTrendValue } from '../common/trends/trendAnalysis';
import { POINT_TYPE } from '../monitor-webgl-base-chart/activePoints';
import { isDefined } from '../../../utils/predicates';
import { TooltipPoint } from './types';
import { TrendResult } from '../common/trends/types';
import { DataStream } from '../../../utils/dataTypes';

export const trendLinePoints = ({
  trendResults,
  dataStreams,
  displayedDate,
}: {
  trendResults: TrendResult[];
  dataStreams: DataStream[];
  displayedDate: Date;
}): TooltipPoint[] => {
  const timestamp = displayedDate.getTime();
  return trendResults
    .filter(({ dataStreamId }) => dataStreams.some(({ id }) => id === dataStreamId))
    .map(trendResult => {
      const dataStream = dataStreams.find(({ id }) => id === trendResult.dataStreamId);
      return dataStream == null
        ? null
        : {
            streamId: dataStream.id,
            label: getTrendLabel(dataStream.name, trendResult.type),
            point: {
              x: timestamp,
              y: getTrendValue(trendResult, timestamp),
            },
            type: POINT_TYPE.TREND,
            color: trendResult.color,
          };
    })
    .filter(isDefined);
};
