import React from 'react';
import { LineChart, StatusTimeline, Dial } from '@synchro-charts/react';
import {COMPARISON_OPERATOR, DataType, StreamType, StatusIcon } from '@synchro-charts/core';
import {MINUTE_IN_MS, SECOND_IN_MS} from "./dateUtil";

const pallet = ['#0073bb', '#6b8ea5'];

const size = {
  fontSize: 50,
  dialThickness: 36,
  iconSize: 48,
  labelSize: 32,
  unitSize: 30,
} 

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

const DURATION = MINUTE_IN_MS;
const MIN_PERIOD = 0.5 * MINUTE_IN_MS;
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

const dataStreamNoUnit = {
  id: '3',
  name: 'Wind temperature',
  data: [
    {
      x: new Date(2001, 0, 0).getTime(),
      y: 1580,
    },
  ],
  resolution: 0,
  dataType: DataType.NUMBER,
}

const dataStreamUnit = {
  id: '4',
  name: 'Wind temperature',
  data: [
    {
      x: new Date(2001, 0, 0).getTime(),
      y: 1580.001,
    },
  ],
  unit: 'rpm',
  resolution: 0,
  dataType: DataType.NUMBER,
}

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
}

const annotations_dial = {
  y: [ {
    color: "#C03F25",
    value: 660,
    comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
    dataStreamIds: ['5'],
    label: {
      text: 'Critical',
      show: true,
    },
    icon: StatusIcon.ERROR,
  },{
    color: "#F29D38",
    value: 1320,
    comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
    dataStreamIds: ['5'],
    label: {
      text: 'Warning',
      show: true,
    },
    icon: StatusIcon.LATCHED,
  },{
    color: "#3F7E23",
    value: 1320,
    comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    dataStreamIds: ['5'],
    label: {
      text: 'Normal',
      show: true,
    },
    icon: StatusIcon.NORMAL,
  },],
  thresholdOptions: {
    showColor: true,
  },
  offsetX: 58,
}

export class LiveDemo extends React.Component {
  constructor(props) {
    super(props);
    this.liveDemoContainer = React.createRef();
    this.state = {
      dataStreams,
      alarmStatusStreams,
      isLiveMode: true,
      viewport: {
        duration: DURATION,
        group: 'Live_demo',
      },
    }
  }

  getRandomColor=()=>{ return '#'+('00000'+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6); }

  addDataPoints = (x) => {
    const { dataStreams, alarmStatusStreams } = this.state;
    const { data } = dataStreamNoUnit
    const [dataStream1, dataStream2] = dataStreams;
    const [alarmStream1, alarmStream2] = alarmStatusStreams;

    const y1 = y(AMPLITUDE, MIN_PERIOD, x);
    const y2 = y(AMPLITUDE * 0.65, 2 * MIN_PERIOD, x);

    dataStream1.data = [...dataStream1.data, { x, y: y1 }];
    dataStream2.data = [...dataStream2.data, { x: x, y: y2 }];

    alarmStream1.data = [...alarmStream1.data, { x, y: alarmStatus( y1 ) }];
    alarmStream2.data = [...alarmStream2.data, { x: x, y: alarmStatus(y2) }];


    const value = Math.round(Math.random()*2001)
    data.push({
      x: Date.now(),
      y: value,
    })
    data.shift()

    dataStreamUnit.data.push({x: Date.now(),y: Math.random()*2001,})
    dataStreamUnit.data.shift()

    this.setState({ dataStreams: [dataStream1, dataStream2], alarmStatusStreams: [alarmStream1, alarmStream2] });
  }

  appendDataPointsPeriodically() {
    setInterval(() => {
      this.addDataPoints(Date.now());
    }, DATA_APPEND_RATE);
  }

  componentDidMount() {
    this.appendDataPointsPeriodically();

    this.liveDemoContainer.current.addEventListener('dateRangeChange', this.onDateRangeChange);
  }

  componentWillUnmount() {
    this.liveDemoContainer.current.removeEventListener('dateRangeChange', this.onDateRangeChange);
  }

  onDateRangeChange = ({ detail: [start, end]}) => {
    this.setState({
      isLiveMode: false,
      viewport: {
        ...this.state.viewport,
        start,
        end,
      }
    })
  }

  render() {
    const { viewport, dataStreams, alarmStatusStreams } = this.state;
    return (
      <div ref={this.liveDemoContainer}>
        <div style={{ height: '250px', width: '100%' }}>
          <LineChart
            widgetId="line-chart-1"
            viewport={viewport}
            dataStreams={dataStreams}
            annotations={propertyAnnotations}
          />
        </div>
        <div style={{ height: '250px', marginLeft: '40px', width: 'calc(100% - 75px)' }}>
          <StatusTimeline
            widgetId="status-timeline-1"
            viewport={viewport}
            dataStreams={alarmStatusStreams}
            annotations={annotations}
          />
        </div>
        <h3>Overiew</h3>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ height: '300px', width: '50%' }}>
            <Dial 
              dataStream={dataStreamNoUnit}
              size={size}
              viewport={{...viewport, yMin: 0, yMax: 2000}} 
            />
          </div>
          <div style={{ height: '300px', width: '50%' }}>
            <Dial 
              dataStream={dataStreamUnit}
              size={{...size, fontSize: 30, unitSize: 20}}
              viewport={{...viewport, yMin: 0, yMax: 2000}} 
            />
          </div>
        </div>
        <h3>Alarm states</h3>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '50px' }}>
          <div style={{ height: '300px', width: '50%' }}>
            <Dial 
              dataStream={{...dataStreamNoUnit, id: '5'}}
              viewport={{...viewport, yMin: 0, yMax: 2000}} 
              associatedStreams={[
                {
                  id: '5',
                  type: StreamType.ALARM,
                },
              ]}
              size={size}
              annotations={annotations_dial}
            />
          </div>
        </div>
      </div>
    )
  }
}
