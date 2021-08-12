import React from 'react';
import Button from "@awsui/components-react/button";
import ButtonDropdown from "@awsui/components-react/button-dropdown";
import Input from "@awsui/components-react/input";
import { LineChart, BarChart, ScatterChart } from '@synchro-charts/react';
import { LEGEND_POSITION,COMPARISON_OPERATOR, TREND_TYPE } from '@synchro-charts/core';
import {DAY_IN_MS}  from "./dateUtil";
import {getRandomData} from "./dataUtil";
import ThresholdListItem from './ThresholdListItem';
import {isNumeric} from "./util";
import TrendLineListItem from "./TrendLineListItem";
import { v4 } from 'uuid';


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
  viewport: {
    start: new Date(1998, 0, 0),
    end: new Date(2000, 0, 1),
  },
  dataStreams: streams,
};

const COMPARISON_OPTIONS = [
  {
    id: COMPARISON_OPERATOR.LESS_THAN,
    text: "Less than '<'",
  },
  {
    id: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
    text: "Less than or equal '<='",
  },
  {
    id: COMPARISON_OPERATOR.GREATER_THAN,
    text: "Greater than '>'",
  },
  {
    id: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
    text: "Greater than or equal '>='",
  },
  {
    id: COMPARISON_OPERATOR.EQUAL,
    text: "Equal '='",
  },
];

const DRAGGABLE_OPTIONS = [
  {
    id: 'false',
    text: 'Disabled',
  },
  {
    id: 'true',
    text: 'Enabled',
  },
];

const CHART_OPTIONS = [
  {
    id: 'lineChart',
    text: 'Line Chart',
  },
  {
    id: 'scatterChart',
    text: 'Scatter Chart',
  },
  {
    id: 'barChart',
    text: 'Bar Chart',
  }
];

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
      annotationLabel: undefined,
      annotationEditable: 'false',
      config: {
        ...TESTING_GROUND_CHART_CONFIG,
        viewport: {
          ...TESTING_GROUND_CHART_CONFIG.viewport,
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

  _handleDragEvent = event => {
    this.setState({
      annotations: event.srcElement.annotations
    });
  };

  componentDidMount() {
    document.body.addEventListener('widgetUpdated', this._handleDragEvent)
  }

  componentWillUnmount() {
    document.body.removeEventListener('widgetUpdated', this._handleDragEvent);
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
      componentTag: e.detail.id
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
    if (event != null && event.detail != null) {
      const targetValue = event.detail.value;
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

  changeAnnotationLabel = (event) => {
    if (event != null && event.detail != null) {
      this.setState({
        annotationLabel: event.detail.value,
      });
    }
  };

  saveThreshold = () => {
    const {annotationColor,annotationValue, annotationComp, annotationEditable, annotationLabel } = this.state;
    const threshold = {
      id: v4(),
      color: annotationColor,
      value: annotationValue,
      showValue: true,
      comparisonOperator: annotationComp,
      isEditable: (annotationEditable === 'true'),
    };

    if (annotationLabel !== undefined) {
      threshold.label = {
        text: annotationLabel,
        show: true,
      };
    }

    this.setState({
      annotations: {
        ...this.state.annotations,
        y: [...(this.state.annotations.y || []), threshold],
      },
      annotationValue: 0,
      isEditable: 'false',
      annotationLabel: undefined,
    });
  };

  changeAnnotationColor = (event) => {
    if (event != null && event.detail != null) {
      this.setState({
        annotationColor: event.detail.value,
      })
    }
  };

  changeAnnotationEditable = (event) => {
    if (event != null && event.detail != null) {
      this.setState({
        annotationEditable: event.detail.id,
      })
    }
  };

  changeAnnotationComparator = (event) => {
    if (event != null && event.detail != null) {
      this.setState({
        annotationComp: event.detail.id,
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

  changeTrendColor = (event) => {
    if (event != null && event.detail != null) {
      this.setState({
        trendColor: event.detail.value,
      })
    }
  };

  changeTrendDataId = (event) => {
    if (event == null || event.detail == null) {
      return;
    }

    const trendDataId = event.detail.id;
    const streamInfo = this.config.dataStreams.find(info => info.id === trendDataId);
    if (streamInfo) {
      this.setState({
        trendColor: streamInfo.color || 'black',
        trendDataId,
      })
    }
  };

  trendOptions = () => {
    return this.config.dataStreams.map(({id, name}) => {
      return {
        id,
        text: name,
      }
    });
  }

  currentTrend = () => {
    const { trendDataId } = this.state;

    if (trendDataId === '' || trendDataId == null) {
      return 'Please select a trend';
    }

    return this.config.dataStreams.find(({id}) => id === trendDataId).name;
  }

  removeTrend = (dataStreamId, trendType) => {
    const trends = this.state.trends.filter(trend => trend.dataStreamId !== dataStreamId || trend.type !== trendType);
    this.setState({
      trends
    });
  };

  currentChartOption = () => {
    const { componentTag } = this.state;
    return CHART_OPTIONS.find(item => item.id === componentTag).text
  }

  currentComparatorOption = () => {
    const { annotationComp } = this.state;

    return COMPARISON_OPTIONS.find(item => item.id === annotationComp).text;
  }

  currentDraggableOption = () => {
    const { annotationEditable } = this.state;

    return DRAGGABLE_OPTIONS.find(item => item.id === annotationEditable).text;
  }

  render() {
    const ChartName = components[this.state.componentTag];
    return (
      <div style={{ fontSize: '1.3rem' }}>
        <div style={{display: 'flex'}}>
          <label htmlFor="display">
            <strong>Display: </strong>
            <ButtonDropdown items={CHART_OPTIONS} onItemClick={this.changeComponent}>{this.currentChartOption()}</ButtonDropdown>
          </label>
          <div style={{flexGrow: '1'}}/>
          <div>
            <Button onClick={this.addStream}>
              Add Data
            </Button>
            {' '}
            <Button disabled={this.numCharts === 0} onClick={this.removeStream}>
              Remove Data
            </Button>
            {' '}
          </div>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {new Array(this.state.numCharts).fill(0).map(i => (
            <div
              key={i}
              className="chart-container"
              style={{

                height: `400px`,
                width: '100%',
              }}
            >
              <ChartName
                widgetId={this.config.widgetId + i.toString()}
                viewport={{...this.config.viewport, duration: this.duration, group: 'DEMO_GROUP'}}
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
                <th>Draggable</th>
                <th>Label (Optional)</th>
              </tr>
              <tr>
                <td>
                  <Input
                    type="color"
                    value={this.state.annotationColor}
                    onChange={this.changeAnnotationColor}
                  />
                </td>
                <td style={{ maxWidth: '80px'}}>
                  <Input
                    {...(this.state.annotationComp !== COMPARISON_OPERATOR.EQUAL && {type: 'number'})}
                    onChange={this.changeAnnotationValue}
                    value={this.state.annotationValue}
                  />
                </td>
                <td>
                  <ButtonDropdown items={COMPARISON_OPTIONS} onItemClick={this.changeAnnotationComparator}>
                    {this.currentComparatorOption()}
                  </ButtonDropdown>
                </td>
                <td>
                  <ButtonDropdown items={DRAGGABLE_OPTIONS} onItemClick={this.changeAnnotationEditable}>
                    {this.currentDraggableOption()}
                  </ButtonDropdown>
                </td>
                <td style={{ maxWidth: '220px'}}>
                  <Input
                    onChange={this.changeAnnotationLabel}
                    value={this.state.annotationLabel}
                  />
                </td>
                <td>
                  <Button onClick={this.saveThreshold} disabled={this.doesThresholdExist()}>
                    Add Threshold
                  </Button>
                </td>
              </tr>
              {this.getThresholds().map((threshold, i) => {
                return (
                  <ThresholdListItem threshold={threshold} thresholdId={i} removeThreshold={this.removeThreshold} key={`${threshold.id}`}/>
                );
              })}
            </table>
          </div>
        </div>
        <div className="configurations">
        <div>
            <h2>Trends</h2>
            <table className="configuration-table">
              <tr>
                <th>Color</th>
                <th>Data Set</th>
              </tr>
              <tr>
                <td>
                  <Input
                    type="color"
                    value={this.state.trendColor}
                    onChange={this.changeTrendColor}
                  />
                </td>
                <td>
                  <ButtonDropdown items={this.trendOptions()} onItemClick={this.changeTrendDataId}>
                    {this.currentTrend()}
                  </ButtonDropdown>
                </td>
                <td>
                  <Button onClick={this.addTrend} disabled={this.doesTrendExist()}>
                    Add Trend
                  </Button>
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
