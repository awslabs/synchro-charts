import { ChartSpecPage, DisableList } from './newChartSpecPage';
import { describeLegend } from './describeLegend';
import { describeLoadingStatus } from './describeLoadingStatus';
import { describeErrorStatus } from './describeErrorStatus';
import { describeYRange } from './describeYRange';
import { describeTrendLines } from './describeTrendLines';
import { describePassedInProps } from './describePassedInProps';

export const describeChart = (newChartSpecPage: ChartSpecPage, disableList: DisableList = {}) => {
  if (!disableList.legend) {
    describeLegend(newChartSpecPage);
  }
  describeLoadingStatus(newChartSpecPage);
  describeErrorStatus(newChartSpecPage);
  if (!disableList.yRange) {
    describeYRange(newChartSpecPage);
  }
  if (!disableList.trends) {
    describeTrendLines(newChartSpecPage);
  }
  describePassedInProps(newChartSpecPage, disableList);
};
