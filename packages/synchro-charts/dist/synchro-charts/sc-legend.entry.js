import { r as registerInstance, h } from './index-44bccbc7.js';
import { D as DATA_ALIGNMENT, L as LEGEND_POSITION } from './constants-4b21170a.js';
import { S as StreamType } from './dataConstants-a26ff694.js';
import './time-f374952b.js';
import { c as isSupportedDataType } from './predicates-ced25765.js';
import './utils-11cae6c8.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import './dataFilters-8fe55407.js';
import { b as breachedThreshold, a as activePoints } from './breachedThreshold-ae43cec9.js';
import { c as getTrendLabel, g as getTrendValue } from './trendAnalysis-2c871eae.js';

const scLegendCss = "sc-legend .legend-container{display:flex;flex-wrap:wrap;overflow-y:scroll;overflow-x:hidden;-ms-overflow-style:none;scrollbar-width:none}sc-legend .legend-container::-webkit-scrollbar{display:none}";

const noop = () => { };
const ScLegend = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isEditing = false;
        this.trendResults = [];
        this.visualizedDataStreams = () => {
            const streams = this.dataStreams.filter(isSupportedDataType(this.supportString));
            if (this.visualizesAlarms) {
                // Visualize all data streams with a valid data type
                return streams;
            }
            // Visualize only property-streams (non-alarms) with a valid data type
            return streams.filter(({ streamType }) => streamType !== StreamType.ALARM);
        };
        /**
         * Returns the given color of a breached threshold, if there is one.
         */
        this.breachedThresholdColor = (point, dataStream) => {
            const threshold = breachedThreshold({
                value: point && point.y,
                date: this.viewPort.end,
                dataStreams: this.dataStreams,
                dataStream,
                thresholds: this.thresholds,
            });
            return threshold ? { color: threshold.color, icon: threshold.icon } : undefined;
        };
    }
    render() {
        const points = activePoints({
            viewPort: this.viewPort,
            dataStreams: this.dataStreams,
            selectedDate: this.viewPort.end,
            allowMultipleDates: true,
            dataAlignment: DATA_ALIGNMENT.EITHER,
        });
        const lastDate = points.length === 0 || points[0].point == null ? this.viewPort.end.getTime() : points[0].point.x;
        return (h("div", { class: "legend-container", style: { flexDirection: this.config.position === LEGEND_POSITION.RIGHT ? 'column' : 'unset' } }, this.visualizedDataStreams().map(dataStream => {
            const dataPoint = points.find(p => p.streamId === dataStream.id);
            const point = dataPoint ? dataPoint.point : undefined;
            const { color: valueColor = undefined, icon = undefined } = this.breachedThresholdColor(point, dataStream) || {};
            return [
                h("sc-legend-row", { streamId: dataStream.id, label: dataStream.name, detailedLabel: dataStream.detailedName, color: dataStream.color || 'black', valueColor: valueColor, point: point, pointType: dataPoint && "data" /* DATA */, unit: dataStream.unit, updateDataStreamName: this.updateDataStreamName, isEditing: this.isEditing, isLoading: this.isLoading, showDataStreamColor: this.showDataStreamColor, icon: icon }),
                ...this.trendResults.reduce((rows, trendResult) => {
                    if (trendResult.dataStreamId === dataStream.id) {
                        rows.push(h("sc-legend-row", { streamId: dataStream.id, label: getTrendLabel(dataStream.name, trendResult.type), detailedLabel: dataStream.detailedName && getTrendLabel(dataStream.detailedName, trendResult.type), color: trendResult.color || dataStream.color || 'black', valueColor: valueColor, point: {
                                x: lastDate,
                                y: getTrendValue(trendResult, lastDate),
                            }, pointType: "trend" /* TREND */, unit: dataStream.unit, updateDataStreamName: noop, isEditing: false, isLoading: this.isLoading, showDataStreamColor: this.showDataStreamColor }));
                    }
                    return rows;
                }, []),
            ];
        })));
    }
};
ScLegend.style = scLegendCss;

export { ScLegend as sc_legend };
