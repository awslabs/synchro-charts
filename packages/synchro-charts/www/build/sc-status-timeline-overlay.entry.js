import { r as registerInstance, i as createEvent, h } from './index-44bccbc7.js';
import { D as DATA_ALIGNMENT, a as StatusIcon } from './constants-4b21170a.js';
import './dataConstants-a26ff694.js';
import './time-f374952b.js';
import './predicates-ced25765.js';
import './_commonjsHelpers-8f072dc7.js';
import { a as getDataPoints } from './utils-11cae6c8.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import './dataFilters-8fe55407.js';
import { c as closestPoint, b as breachedThreshold } from './breachedThreshold-ae43cec9.js';
import { u as updateName } from './helper-9441cc0b.js';

const scStatusTimelineOverlayCss = "sc-status-timeline-overlay .expando{flex-grow:1}sc-status-timeline-overlay .overlay-container{position:absolute;display:flex;flex-direction:column;justify-content:space-between}";

const SMUDGE_WIDTH_PX = 1; // We slice off a tiny bit of width to prevent some pixels showing under antialiasing
const ScStatusTimelineOverlay = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.widgetUpdated = createEvent(this, "widgetUpdated", 7);
        /** Widget data stream names */
        this.names = [];
        this.onChangeLabel = ({ streamId, name }) => {
            this.names = updateName(this.names, name, streamId);
            this.onWidgetUpdated();
        };
    }
    /**
     * On Widget Updated - Persist `DataStreamInfo`
     *
     * Emits an event which persists the current `NameValue[]` state into the
     * data stream info.
     */
    onWidgetUpdated() {
        const { widgetId, dataStreams } = this;
        // Construct the config update with the new names specified.
        const configUpdate = {
            widgetId,
            dataStreams: dataStreams.map(info => {
                const nameValue = this.names.find(({ id: nameId }) => info.id === nameId);
                const name = nameValue != null ? nameValue.name : info.name;
                return {
                    id: info.id,
                    name,
                };
            }),
        };
        this.widgetUpdated.emit(configUpdate);
    }
    render() {
        const { width, height, marginLeft, marginRight, marginTop, marginBottom } = this.size;
        return (h("div", { class: "overlay-container", style: {
                width: `${width - marginRight - marginLeft - SMUDGE_WIDTH_PX}px`,
                height: `${height - marginTop - marginBottom}px`,
                left: `${marginLeft}px`,
                top: `${marginTop}px`,
            } }, this.dataStreams.map(dataStream => {
            const point = closestPoint(getDataPoints(dataStream, dataStream.resolution), this.date, DATA_ALIGNMENT.LEFT);
            const value = point ? point.y : undefined;
            const threshold = breachedThreshold({
                value,
                date: this.date,
                dataStreams: this.dataStreams,
                dataStream,
                thresholds: this.thresholds,
            });
            const { error } = dataStream;
            const displayedValue = error == null ? value : error;
            const displayedUnit = error == null ? dataStream.unit : undefined;
            const valueColor = error == null && threshold != null ? threshold.color : undefined;
            return (h("sc-status-timeline-overlay-row", { key: dataStream.id, label: dataStream.name, detailedLabel: dataStream.detailedName, value: displayedValue, unit: displayedUnit, isEditing: this.isEditing, valueColor: valueColor, icon: error == null ? threshold && threshold.icon : StatusIcon.ERROR, onNameChange: (name) => this.onChangeLabel({ streamId: dataStream.id, name }) }));
        })));
    }
};
ScStatusTimelineOverlay.style = scStatusTimelineOverlayCss;

export { ScStatusTimelineOverlay as sc_status_timeline_overlay };
