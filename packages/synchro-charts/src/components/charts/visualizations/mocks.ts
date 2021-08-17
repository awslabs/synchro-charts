import { DataStream } from '../../../utils/dataTypes';
import { VisualizationOptions } from '../sc-webgl-base-chart/types';
import { CHART_SIZE } from '../../../testing/test-routes/charts/shaders/chartSize';
import { VIEWPORT } from '../common/testUtil';
import { VisualizationProgram } from '../../sc-webgl-context/types';
import { chartScene } from '../sc-scatter-chart/chartScene';
import { DataType } from '../../../utils/dataConstants';

const STREAM_1 = {
  visualizationType: 'some-viz',
  id: 'data-stream',
  name: 'some name',
  resolution: 0,
  data: [],
  dataType: DataType.NUMBER,
};

const dataStreams = [STREAM_1];

export const mockProgramOptions = (streams: DataStream[] = dataStreams): VisualizationOptions => ({
  dataStreams: streams,
  chartSize: CHART_SIZE,
  viewport: VIEWPORT,
  container: document.createElement('div'),
  minBufferSize: 100,
  bufferFactor: 2,
  thresholdOptions: {
    showColor: false,
  },
  thresholds: [],
  position: {
    x: 0,
    y: 100,
    width: 150,
    height: 200,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    left: 100,
    right: 100,
    top: 120,
    bottom: 130,
  },
});
export const createVisualization = (streams: DataStream[] = dataStreams): VisualizationProgram => {
  const container = document.createElement('div');

  return chartScene({
    container,
    viewport: VIEWPORT,
    chartSize: CHART_SIZE,
    dataStreams: streams,
    minBufferSize: 0,
    bufferFactor: 1,
    thresholds: [],
    thresholdOptions: {
      showColor: false,
    },
  });
};
