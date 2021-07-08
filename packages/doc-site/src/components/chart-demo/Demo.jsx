import React from 'react';
import { LineChart, BarChart, ScatterChart } from '@synchro-charts/react';
import { LEGEND_POSITION,COMPARISON_OPERATOR, TREND_TYPE } from '@synchro-charts/core';
import {DAY_IN_MS}  from "./dateUtil";
import {getRandomData} from "./dataUtil";
import ThresholdListItem from './ThresholdListItem';
import {isNumeric} from "./util";
import TrendLineListItem from "./TrendLineListItem";

import './Demo.css';

const components = {
  lineChart: LineChart,
  barChart: BarChart,
  scatterChart: ScatterChart,
};

const pallet = ['#0073bb', '#dd6b10', '#1d8102', '#8b3333'];
const DEFAULT_TAG = 'lineChart';

const streams = [...Array(2)].map((_, i) => {
  const data=  getRandomData({
    start: new Date(1998, 0, 0),
    end: new Date(2000, 0, 1),
    streamId: `some-id-${i}`,
    resolution: DAY_IN_MS,
  });

  return {
    ...data,
    name: 'Asset ' + i,
    detailedName: `Asset ${i} - Factory ${i}`,
    color: pallet[i],
    unit: 'm/s',
  }
})

const TESTING_GROUND_CHART_CONFIG = {
  widgetId: 'fake-id',
  legend: {
    position: LEGEND_POSITION.BOTTOM,
    width: 170,
  },
  viewPort: {
    start: new Date(1998, 0, 0),
    end: new Date(2000, 0, 1),
  },
  dataStreams: streams,
};

export class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numCharts: 1,
      componentTag: DEFAULT_TAG,
      trendDataId: '',
      trendType: TREND_TYPE.LINEAR,
      trendColor: 'black',
      trends: [],
      annotationColor: '#d13212',
      annotationValue: 0,
      annotationComp: COMPARISON_OPERATOR.LESS_THAN,
      config: {
        ...TESTING_GROUND_CHART_CONFIG,
        viewPort: {
          ...TESTING_GROUND_CHART_CONFIG.viewPort,
          start: new Date(1998, 0, 0),
          end: new Date(1998, 1, 0),
        }
      },
      annotations: {
        x: [],
        y: [],
        thresholdOptions: {
          showColor: true,
        },
      }
    }
  }

  get config () {
    return this.state.config;
  }

  addStream = () => {
    const index = this.config.dataStreams.length;
    const color = pallet[index % pallet.length];
    const id = (index + 1).toString();
    if (id != null) {
      const data = getRandomData({
        start: new Date(1998, 0, 0),
        end: new Date(2000, 0, 1),
        streamId: `some-id-${index}`,
        resolution: DAY_IN_MS,
      });

      this.setState({
        config: {
          ...this.config,
          dataStreams: [
            ...this.config.dataStreams,
            {
              ...data,
              name: 'Asset ' + index,
              detailedName: `Asset ${index} - Factory ${index}`,
              color,
              unit: 'm/s',
            },
          ],
        }
      });
    }
  };

  // Remove last added stream
  removeStream = () => {
    this.setState({
      config: {
        ...this.config,
        dataStreams: this.config.dataStreams.slice(0, -1),
      }
    })
  };

  changeComponent = (e) => {
    this.setState({
      componentTag: e.target.value
    });
  };

  getThresholds = () =>
  this.state.annotations && this.state.annotations.y ?
    this.state.annotations.y.filter(t => t.comparisonOperator != null) : [];

  // checks if threshold exists with the selected value and comparison operator

  doesThresholdExist = () => {
    return this.getThresholds().some(
      threshold => threshold.value === this.annotationValue && threshold.comparisonOperator === this.state.annotationComp
    );
  };

  changeAnnotationValue = (event) => {
    if (event != null && event.target != null) {
      const targetValue = event.target.value;
      if (!isNumeric(targetValue)) {
        this.setState({
          annotationValue: targetValue,
        })
      }
      if (isNumeric(targetValue)) {
        this.setState({
          annotationValue: Number(targetValue),
        })
      }
    }
  };

  saveThreshold = () => {
    const {annotationColor,annotationValue, annotationComp } = this.state;
    const threshold = {
      color: annotationColor,
      value: annotationValue,
      showValue: true,
      comparisonOperator: annotationComp,
    };

    this.setState({
      annotations: {
        ...this.state.annotations,
        y: [...(this.state.annotations.y || []), threshold],
      },
      annotationValue: 0,
    });
  };

  changeAnnotationColor = (event) => {
    if (event != null && event.target != null) {
      this.setState({
        annotationColor: event.target.value,
      })
    }
  };

  changeAnnotationComparator = (event) => {
    if (event != null && event.target != null) {
      this.setState({
        annotationComp: event.target.value,
      })
    }
  };

  removeThreshold = (index) => {
    const { annotations } = this.state;

    if (annotations == null || annotations.y == null || annotations.y.length === 0) {
      return;
    }
    // This assume that all Y in annotations are thresholds
    const { y } = annotations;

    this.setState({
      annotations: {
        ...annotations,
        y: y.filter((_, i) => i !== index),
      }
    })
  };

  // checks if the selected trend type exists on the selected metric
  doesTrendExist = () => {
    return (
      this.state.trendDataId === '' ||
      this.state.trends.some(trend => trend.dataStreamId === this.trendDataId && trend.type === this.trendType)
    );
  };

  addTrend = () => {
    if (!this.doesTrendExist()) {
      const newTrends = [
        ...this.state.trends,
        {
          type: this.state.trendType,
          dataStreamId: this.state.trendDataId,
          color: this.state.trendColor,
        },
      ];

      this.setState({
        trends: newTrends,
      })
    }
  };

  changeTrendDataId = (event) => {
    if (event == null || event.target == null) {
      return;
    }

    const trendDataId = event.target.value;
    const streamInfo = this.config.dataStreams.find(info => info.id === trendDataId);
    if (streamInfo) {
      this.setState({
        trendColor: streamInfo.color || 'black',
        trendDataId,
      })
    }
  };

  removeTrend = (dataStreamId, trendType) => {
    const trends = this.state.trends.filter(trend => trend.dataStreamId !== dataStreamId || trend.type !== trendType);
    this.setState({
      trends
    });
  };

  render() {
    const ChartName = components[this.state.componentTag];
    return (
      <div style={{ fontSize: '1.1rem' }}>
        <div style={{display: 'flex'}}>
          <label htmlFor="display">
            <strong>Display: </strong>
            <select id="display" onChange={this.changeComponent}>
              <option value="lineChart">Line Chart</option>
              <option value="scatterChart">Scatter Chart</option>
              <option value="barChart">Bar Chart</option>
            </select>
          </label>
          <div style={{flexGrow: '1'}}/>
          <div>
            <button onClick={this.addStream}>
              <strong>+</strong> Data
            </button>
            {' '}
            <button disabled={this.numCharts === 0} onClick={this.removeStream}>
              <strong>-</strong> Data
            </button>
            {' '}
          </div>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {new Array(this.state.numCharts).fill(0).map(i => (
            <div
              className="chart-container"
              style={{

                height: `400px`,
                width: '100%',
              }}
            >
              <ChartName
                widgetId={this.config.widgetId + i.toString()}
                viewPort={{...this.config.viewPort, duration: this.duration, group: 'DEMO_GROUP'}}
                legend={this.config.legend}
                dataStreams={this.config.dataStreams}
                annotations={this.state.annotations}
                trends={this.state.trends}
              />
            </div>
          ))}
        </div>
        <div className="configurations">
          <div>
            <h2>Thresholds</h2>
            <table className="configuration-table">
              <tr>
                <th>Color</th>
                <th>Value</th>
                <th>Comparator</th>
              </tr>
              <tr>
                <td>
                  <input
                    style={{height: '18px'}}
                    type="color"
                    value={this.state.annotationColor}
                    onChange={this.changeAnnotationColor}
                  />
                </td>
                <td>
                  <input
                    style={{width: '60px'}}
                    {...(this.state.annotationComp !== COMPARISON_OPERATOR.EQUAL && {type: 'number'})}
                    onChange={this.changeAnnotationValue}
                    placeholder="value"
                    value={this.state.annotationValue}
                  />
                </td>
                <td>
                  <select onChange={this.changeAnnotationComparator}>
                    <option value={COMPARISON_OPERATOR.LESS_THAN}>Less than {"'<'"}</option>
                    <option value={COMPARISON_OPERATOR.LESS_THAN_EQUAL}>Less than or equal {"'<='"}</option>
                    <option value={COMPARISON_OPERATOR.GREATER_THAN}>Greater than {"'>'"} </option>
                    <option value={COMPARISON_OPERATOR.GREATER_THAN_EQUAL}>Greater than or equal {"'>='"} </option>
                    <option value={COMPARISON_OPERATOR.EQUAL}>Equal &#39;=&#39; </option>
                  </select>
                </td>
                <td>
                  <button onClick={this.saveThreshold} disabled={this.doesThresholdExist()}>
                    Add Threshold
                  </button>
                </td>
              </tr>
              {this.getThresholds().map((threshold, i) => {
                return (
                  <ThresholdListItem threshold={threshold} thresholdId={i} removeThreshold={this.removeThreshold}/>
                );
              })}
            </table>
          </div>
          <div>
            <h2>Trends</h2>
            <table className="configuration-table">
              <tr>
                <th>Color</th>
                <th>Data Set</th>
              </tr>
              <tr>
                <td>
                  <input
                    style={{height: '18px'}}
                    type="color"
                    value={this.state.trendColor}
                    onChange={this.changeTrendColor}
                  />
                </td>
                <td>
                  <select onChange={this.changeTrendDataId}>
                    <option value="">Select a data set</option>
                    {this.config.dataStreams.map(({id, name}) => {
                      return <option value={id}>{name}</option>;
                    })}
                  </select>
                </td>
                <td>
                  <button onClick={this.addTrend} disabled={this.doesTrendExist()}>
                    Add Trend
                  </button>
                </td>
              </tr>
              {this.state.trends.map(trend => {
                const stream = this.config.dataStreams.find(elt => elt.id === trend.dataStreamId);
                if (stream) {
                  return (
                    <TrendLineListItem
                      dataStreamName={stream.name}
                      trend={trend}
                      removeTrendLine={this.removeTrend}
                    />
                  );
                }
                return null;
              })}
            </table>
          </div>
          </div>
      </div>
    )
  }
}
