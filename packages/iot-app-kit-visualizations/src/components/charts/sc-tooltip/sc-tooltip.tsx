import { Component, h, Prop, State, Element } from '@stencil/core';

import { DataStream, SizeConfig, ViewPort } from '../../../utils/dataTypes';
import { tooltipPosition } from './tooltipPosition';
import { Threshold } from '../common/types';
import { TrendResult } from '../common/trends/types';
import { DATA_ALIGNMENT } from '../common/constants';
import { activePoints, POINT_TYPE } from '../sc-webgl-base-chart/activePoints';
import { isDefined, isSupportedDataType } from '../../../utils/predicates';
import { TooltipPoint, TooltipPositioning } from './types';
import { StreamType } from '../../../utils/dataConstants';
import { trendLinePoints } from './trendLinePoints';
import { sortTooltipPoints } from './sort';

const TOOLTIP_ROW_HEIGHT = 21;
const TOOLTIP_EMPTY_HEIGHT = 71;
const X_OFFSET = 16;

/**
 * The parent tooltip container, listens for events to ensure tooltip renders at the correct position at the correct time.
 */
@Component({
  tag: 'iot-app-kit-vis-tooltip',
  styleUrl: 'sc-tooltip.css',
  shadow: false,
})
export class ScTooltip {
  @Element() el: HTMLElement;
  @Prop() baseChartRef: HTMLElement;

  @Prop() size!: SizeConfig;
  @Prop() dataContainer!: HTMLElement;
  @Prop() dataStreams!: DataStream[];
  @Prop() viewport!: ViewPort;
  @Prop() thresholds!: Threshold[];
  @Prop() trendResults: TrendResult[] = [];
  @Prop() maxDurationFromDate?: number; // milliseconds
  @Prop() showDataStreamColor: boolean = true;
  @Prop() supportString!: boolean;
  @Prop() visualizesAlarms!: boolean;
  // If false, do not display a tooltip row if there is no associated point.
  @Prop() showBlankTooltipRows: boolean = false;
  @Prop() widgetId: string;

  /**
   * If we are drawing data from the data timestamp to timestamp + resolution
   * we want the tooltip to align on the left side
   *
   * Otherwise we are drawing the data from timestamp - resolution to timestamp
   * then we want the tooltip to align on the right side
   */
  @Prop() dataAlignment!: DATA_ALIGNMENT;
  /**
   * CSS Top property for the tooltip container
   */
  @Prop() top: number;
  @Prop() sortPoints: boolean = true;

  @State() selectedDate?: Date;
  @State() toolTipPositioning?: TooltipPositioning;

  private portal: HTMLElement;

  componentWillLoad() {
    this.portal = document.createElement('div');
    this.portal.setAttribute('id', `tooltip-portal-${this.widgetId}`);
    this.portal.classList.add('tooltip-portal');
    this.portal.style.zIndex = '100';
    this.portal.style.position = 'fixed';
    this.portal.style.height = '0';
    document.body.append(this.portal);
  }

  componentDidLoad() {
    this.dataContainer.addEventListener('mousemove', this.setSelectedDate);
    this.dataContainer.addEventListener('mouseleave', this.hideTooltip);
    this.dataContainer.addEventListener('mousedown', this.hideTooltip, { capture: true });
  }

  disconnectedCallback() {
    this.dataContainer.removeEventListener('mousemove', this.setSelectedDate);
    this.dataContainer.removeEventListener('mouseleave', this.hideTooltip);
    this.dataContainer.removeEventListener('mousedown', this.hideTooltip);
  }

  tooltipHeight = (numRows: number) => numRows * TOOLTIP_ROW_HEIGHT + TOOLTIP_EMPTY_HEIGHT;

  visualizedDataStreams = (): DataStream[] => {
    const streams = this.dataStreams.filter(isSupportedDataType(this.supportString));

    if (this.visualizesAlarms) {
      // Visualize all infos with a valid data type
      return streams;
    }

    // Visualize only property-infos (non-alarms) with a valid data type
    return streams.filter(({ streamType }) => streamType !== StreamType.ALARM);
  };

  /**
   * The point in time which is 'actively' being viewed within the tooltip.
   */
  getDisplayedDate = (points: TooltipPoint[], selectedDate: Date): Date => {
    const resolutions = this.dataStreams.map(({ resolution }) => resolution);
    const minResolution = resolutions.length > 0 ? Math.min(...resolutions) : 0;

    if (minResolution === 0) {
      return selectedDate;
    }
    const firstPoint = points[0] && points[0].point ? new Date(points[0].point.x) : undefined;
    const firstPointTrend = this.trendResults[0] ? this.trendResults[0].startDate : undefined;

    return firstPoint || firstPointTrend || selectedDate;
  };

  getTooltipPoints = (selectedDate: Date): TooltipPoint[] => {
    const resolutions = this.dataStreams.map(({ resolution }) => resolution);
    const minResolution = resolutions.length > 0 ? Math.min(...resolutions) : 0;

    const dataPoints = activePoints({
      viewport: this.viewport,
      dataStreams: this.visualizedDataStreams(),
      dataAlignment: this.dataAlignment,
      selectedDate,
      allowMultipleDates: minResolution === 0,
      maxDurationFromDate: this.maxDurationFromDate,
    }).map(p => ({
      ...p,
      type: POINT_TYPE.DATA,
    }));

    const trendPoints = trendLinePoints({
      dataStreams: this.dataStreams,
      displayedDate: this.getDisplayedDate(dataPoints, selectedDate),
      trendResults: this.trendResults,
    });

    const tooltipPoints = [...dataPoints, ...trendPoints];

    // Either sort, or place them in the order the infos are presented
    const points = this.sortPoints
      ? tooltipPoints.sort(sortTooltipPoints(p => p.y))
      : this.dataStreams.map(({ id }) => tooltipPoints.find(p => p.streamId === id)).filter(isDefined);

    // Optionally filter out anything without a point
    if (this.showBlankTooltipRows) {
      return points;
    }
    return points.filter(p => p.point != null);
  };

  positionPortal = () => {
    if (!this.selectedDate) return;

    const points = this.getTooltipPoints(this.selectedDate);
    const resolutions = this.dataStreams.map(({ resolution }) => resolution);
    const minResolution = resolutions.length > 0 ? Math.min(...resolutions) : 0;

    const position = tooltipPosition({
      points,
      resolution: minResolution,
      viewport: this.viewport,
      size: this.size,
      selectedTimestamp: this.selectedDate.getTime(),
    });

    if (!position) return;

    const displayToolTipOnLeftSize = position.x >= this.size.width / 2;

    const tooltipContainerTop = this.top != null ? `${this.top}px` : `${position.y - this.size.height}px`;

    const { y } = this.baseChartRef.getBoundingClientRect();

    this.portal.style.top = `${y + this.size.marginTop}px`;

    if (displayToolTipOnLeftSize) {
      this.toolTipPositioning = {
        top: tooltipContainerTop,
        right: `${-position.x + X_OFFSET - this.size.marginRight}px`,
        left: 'initial',
        transform: 'translateX(-100%)',
        ...position,
      };
    } else {
      this.toolTipPositioning = {
        top: tooltipContainerTop,
        right: 'initial',
        left: `${position.x + X_OFFSET + this.size.marginLeft}px`,
        transform: 'initial',
        ...position,
      };
    }
  };

  setSelectedDate = ({ offsetX, buttons }: MouseEvent) => {
    const isMouseBeingPressed = buttons > 0;

    if (!isMouseBeingPressed && offsetX != null) {
      // Determine the date which corresponds with the mouses position.
      const { start, end } = this.viewport;
      const { width } = this.size;

      const ratio = offsetX / width;
      const viewportDuration = end.getTime() - start.getTime();
      const selectedDateMS = start.getTime() + viewportDuration * ratio;

      this.selectedDate = new Date(selectedDateMS);

      this.positionPortal();

      const tooltipContent = this.el.querySelector('iot-app-kit-vis-tooltip-rows') as HTMLElement | undefined;
      if (tooltipContent) this.portal.appendChild(tooltipContent);
    } else {
      this.selectedDate = undefined;
    }
  };

  hideTooltip = () => {
    this.selectedDate = undefined;
  };

  render() {
    const resolution = this.dataStreams.length > 0 ? this.dataStreams[0].resolution : undefined;
    if (resolution == null || this.selectedDate == null || this.toolTipPositioning == null) {
      return null;
    }

    return (
      <iot-app-kit-vis-tooltip-rows
        trendResults={this.trendResults}
        size={this.size}
        dataStreams={this.dataStreams}
        viewport={this.viewport}
        selectedDate={this.selectedDate}
        thresholds={this.thresholds}
        showDataStreamColor={this.showDataStreamColor}
        tooltipPoints={this.getTooltipPoints(this.selectedDate)}
        toolTipPositioning={this.toolTipPositioning}
      />
    );
  }
}
