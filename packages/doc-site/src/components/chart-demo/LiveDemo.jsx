import React from 'react';
import { LineChart, StatusTimeline } from '@synchro-charts/react';
import {COMPARISON_OPERATOR, DataType, StreamType} from '@synchro-charts/core';
import {MINUTE_IN_MS, SECOND_IN_MS} from "./dateUtil";

const pallet = ['#0073bb', '#6b8ea5'];

const alarmStatus = (v) => {
  if (Math.abs(v) > 80) {
    return 'ALERT';
  }
  if (Math.abs(v) > 60) {
    return 'WARNING';
  }
  return 'OK'
}



export const y = (ampl, period, time) => {
  return ampl * Math.sin(2 * Math.PI / period * time);
}

const DURATION = MINUTE_IN_MS * 3;
const MIN_PERIOD = 0.5 * MINUTE_IN_MS;
const TIME_FRAME_RATE = SECOND_IN_MS / 15; // 15 FPS
const DATA_APPEND_RATE = SECOND_IN_MS;
const AMPLITUDE = 100;


const start = Date.now() - MINUTE_IN_MS * 50;
const duration = Date.now() - start;
const points = Math.floor(duration / DATA_APPEND_RATE);

const streamData1 = new Array(points).fill(0).map((_, index) => {
  const x = start + index * DATA_APPEND_RATE;
  return { x, y: y(AMPLITUDE, MIN_PERIOD, x) };
});

const streamData2 = new Array(points).fill(0).map((_, index) => {
  const x = start + index * DATA_APPEND_RATE;
  return { x, y: y(AMPLITUDE * 0.65, MIN_PERIOD * 2, x) };
});

const dataStreams = [{
  id: '1',
  dataType: DataType.NUMBER,
  name: 'Wind Mill',
  data: streamData1,
  resolution: 0,
  color: pallet[0],
}, {
  id: '2',
  name: 'Engine',
  dataType: DataType.NUMBER,
  data: streamData2,
  resolution: 0,
  color: pallet[1],
}];

const alarmStatusStreams = [{
  id: '1',
  streamType: StreamType.ALARM,
  dataType: DataType.STRING,
  name: 'Wind Mill',
  data: streamData1.map(({ x, y }) => ({ x, y: alarmStatus(y) })),
  resolution: 0,
  color: pallet[0],
}, {
  id: '2',
  name: 'Engine',
  streamType: StreamType.ALARM,
  dataType: DataType.STRING,
  data: streamData2.map(({ x, y }) => ({ x, y: alarmStatus(y) })),
  resolution: 0,
  color: pallet[1],
},
]


const propertyAnnotations = {
    y: [
      {
      color: '#d13212',
      value: -80,
        showValue: true,
        label: 'Alert',
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
    }, {
      color: '#ff9900',
      showValue: true,
      value: -60,
        label: 'Warning',
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
    },
    {
      color: '#d13212',
      value: 80,
      showValue: true,
      label: 'Alert',
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
    }, {
      color: '#ff9900',
      value: 60,
      showValue: true,
      label: 'Warning',
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
    },
  ],
  thresholdOptions: {
    showColor: true,
  },
}

const annotations = {
  y: [{
    color: '#d13212',
    value: 'ALERT',
    comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  }, {
    color: '#ff9900',
    value: 'WARNING',
    comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  }, {
    color: '#1d8102',
    value: 'OK',
    comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  }],
  thresholdOptions: {
    showColor: true,
  },
}

export class LiveDemo extends React.Component {
  constructor(props) {
    super(props);
    this.liveDemoContainer = React.createRef();
    this.state = {
      dataStreams,
      alarmStatusStreams,
      isLiveMode: true,
      viewPort: {
        start: new Date (Date.now() - DURATION),
        end: new Date(),
        group: 'Live_demo',
      },
    }
  }

  enableLiveMode() {
    setInterval(() => {
      if (this.state.isLiveMode) {
        this.setState({
          viewPort: {
            ...this.state.viewPort,
            start: new Date (Date.now() - DURATION),
            end: new Date(),
          },
        })
      }
    }, TIME_FRAME_RATE);
  }

  addDataPoints = (x) => {
    const { dataStreams, alarmStatusStreams } = this.state;
    const [dataStream1, dataStream2] = dataStreams;
    const [alarmStream1, alarmStream2] = alarmStatusStreams;

    const y1 = y(AMPLITUDE, MIN_PERIOD, x);
    const y2 = y(AMPLITUDE * 0.65, 2 * MIN_PERIOD, x);

    dataStream1.data = [...dataStream1.data, { x, y: y1 }];
    dataStream2.data = [...dataStream2.data, { x: x, y: y2 }];

    alarmStream1.data = [...alarmStream1.data, { x, y: alarmStatus( y1 ) }];
    alarmStream2.data = [...alarmStream2.data, { x: x, y: alarmStatus(y2) }];

    this.setState({ dataStreams: [dataStream1, dataStream2], alarmStatusStreams: [alarmStream1, alarmStream2] });
  }

  appendDataPointsPeriodically() {
    setInterval(() => {
      this.addDataPoints(Date.now());
    }, DATA_APPEND_RATE);
  }

  componentDidMount() {
    this.enableLiveMode();
    this.appendDataPointsPeriodically();

    this.liveDemoContainer.current.addEventListener('dateRangeChange', this.onDateRangeChange);
  }

  componentWillUnmount() {
    this.liveDemoContainer.current.removeEventListener('dateRangeChange', this.onDateRangeChange);
  }

  onDateRangeChange = ({ detail: [start, end]}) => {
    this.setState({
      isLiveMode: false,
      viewPort: {
        ...this.state.viewPort,
        start,
        end,
      }
    })
  }

  render() {
    const { viewPort, dataStreams, alarmStatusStreams } = this.state;
    return (
      <div ref={this.liveDemoContainer}>
        <div style={{ height: '250px', width: '100%' }}>
          <LineChart
            widgetId="line-chart-1"
            viewPort={viewPort}
            dataStreams={dataStreams}
            annotations={propertyAnnotations}
          />
        </div>
        <div style={{ height: '250px', marginLeft: '40px', width: 'calc(100% - 75px)' }}>
          <StatusTimeline
            widgetId="status-timeline-1"
            viewPort={viewPort}
            dataStreams={alarmStatusStreams}
            annotations={annotations}
          />
        </div>
      </div>
    )
  }
}
