import { AggregateType, DataStream } from '../../../../../utils/dataTypes';
import { DataType } from '../../../../../utils/dataConstants';

export const DATA_STREAMS: DataStream[] = [
  {
    name: 'some name',
    resolution: 1000,
    id: '1',
    aggregationType: AggregateType.AVERAGE,
    aggregates: {
      1000: [
        { x: new Date(1995, 0, 1).getTime(), y: 0 },
        { x: new Date(2000, 0, 2).getTime(), y: 10 },
        { x: new Date(2010, 0, 3).getTime(), y: 20 },
        { x: new Date(2020, 0, 4).getTime(), y: 50 },
      ],
    },
    data: [],
    dataType: DataType.NUMBER,
  },
];
