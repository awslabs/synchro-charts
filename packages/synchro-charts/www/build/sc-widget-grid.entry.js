import { r as registerInstance, i as createEvent, h } from './index-44bccbc7.js';
import { D as DATA_ALIGNMENT } from './constants-4b21170a.js';
import { S as StreamType } from './dataConstants-a26ff694.js';
import './time-f374952b.js';
import './three.module-af3affdd.js';
import { w as webGLRenderer } from './webglContext-25ec9599.js';
import { b as isDefined } from './predicates-ced25765.js';
import './_commonjsHelpers-8f072dc7.js';
import { c as getThresholds } from './utils-11cae6c8.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import './dataFilters-8fe55407.js';
import { a as activePoints, b as breachedThreshold } from './breachedThreshold-ae43cec9.js';
import { v as viewPortStartDate, a as viewPortEndDate } from './viewPort-ee120ad9.js';
import { u as updateName } from './helper-9441cc0b.js';

/**
 * Given a list of infos, return the ones that are to be visualized.
 *
 * This will remove any alarms that don't have an associated property info.
 */
const removePairedAlarms = (streams) => {
    const alarmInfos = streams.filter(({ streamType }) => streamType === StreamType.ALARM);
    const propertyInfos = streams.filter(({ streamType }) => streamType !== StreamType.ALARM);
    // If an alarm is not 'part' of any property info, it is a stray and can be visualized.
    const isStrayAlarm = ({ id }) => !propertyInfos.some(({ associatedStreams = [] }) => associatedStreams.some(a => a.id === id));
    const strayAlarmInfos = alarmInfos.filter(isStrayAlarm);
    const visualizedInfoIds = [...propertyInfos, ...strayAlarmInfos].map(({ id }) => id);
    // Want to maintain the original order, so we will filter out what isn't included from our original input.
    return streams.filter(({ id }) => visualizedInfoIds.includes(id)).filter(isDefined);
};
/**
 * Returns alarm/property pairs.
 *
 * For instance, if you have one property with 3 alarms associated with it, this will return you 3 pairs in total. One pair for each alarm.
 */
const streamPairs = (dataStreams) => {
    const primaryInfos = removePairedAlarms(dataStreams);
    return primaryInfos
        .map(stream => {
        if (stream.streamType === StreamType.ALARM) {
            // if it's an alarm an not removed, that means it's not pair, and has no associated property.
            return [{ alarm: stream }];
        }
        const hasNoAssociatedAlarms = stream.associatedStreams == null || !stream.associatedStreams.some(({ type }) => type === StreamType.ALARM);
        if (hasNoAssociatedAlarms) {
            // No alarms, just report back the property
            return [{ property: stream }];
        }
        // Return on cell info for each alarm associated
        return (stream.associatedStreams || [])
            .map(({ id: associatedId }) => dataStreams.find(({ id: id2 }) => id2 === associatedId))
            .filter(isDefined)
            .map(alarmInfo => ({
            property: stream,
            alarm: alarmInfo,
        }));
    })
        .flat();
};

const scWidgetGridCss = "sc-widget-grid .help-icon-container{z-index:100;position:absolute;right:0;top:0}sc-widget-grid .container{display:flex;flex-direction:column;height:100%;overflow:auto;position:relative;-ms-overflow-style:none;scrollbar-width:none}sc-widget-grid .container::-webkit-scrollbar{display:none}";

const MSG = 'This visualization displays only live data. Choose a live time frame to display data in this visualization.';
const title = ({ alarm, property }) => {
    if (property) {
        return property.detailedName || property.name;
    }
    if (alarm) {
        return alarm.detailedName || alarm.name;
    }
    return '';
};
const ScWidgetGrid = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.widgetUpdated = createEvent(this, "widgetUpdated", 7);
        this.collapseVertically = true;
        this.isEditing = false;
        this.messageOverrides = {};
        this.liveModeOnlyMessage = MSG;
        /** Widget data stream names */
        this.names = [];
        /** Active Viewport */
        this.start = viewPortStartDate(this.viewPort);
        this.end = viewPortEndDate(this.viewPort);
        this.duration = this.viewPort.duration;
        this.onUpdate = ({ start, end, duration }) => {
            // Update active viewport
            this.start = start;
            this.end = end;
            this.duration = duration;
        };
        this.onChangeLabel = ({ streamId, name }) => {
            this.names = updateName(this.names, name, streamId);
            this.onWidgetUpdated();
        };
        this.getPoints = () => activePoints({
            viewPort: {
                start: this.start,
                end: this.end,
            },
            dataStreams: this.rawData(),
            selectedDate: this.end,
            allowMultipleDates: true,
            dataAlignment: DATA_ALIGNMENT.EITHER,
        });
        this.getBreachedThreshold = (point, dataStream) => breachedThreshold({
            value: point && point.y,
            date: this.viewPort.end || new Date(),
            dataStreams: this.dataStreams,
            dataStream,
            thresholds: getThresholds(this.annotations),
        });
        /**
         * return all the raw data, that is, data that has no form of aggregation ran upon it. The data represents some
         * measurement, at a given point in time.
         */
        this.rawData = () => this.dataStreams.filter(({ resolution }) => resolution === 0);
    }
    componentDidLoad() {
        webGLRenderer.addChartScene({
            id: this.widgetId,
            viewPortGroup: this.viewPort.group,
            dispose: () => { },
            updateViewPort: this.onUpdate,
        });
    }
    onViewPortChange(newViewPort) {
        this.onUpdate(Object.assign(Object.assign({}, newViewPort), { start: viewPortStartDate(this.viewPort), end: viewPortEndDate(this.viewPort) }));
    }
    disconnectedCallback() {
        // necessary to make sure that the allocated memory is released, and nothing is incorrectly rendered.
        webGLRenderer.removeChartScene(this.widgetId);
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
            dataStreams: dataStreams.map(stream => {
                const nameValue = this.names.find(({ id: nameId }) => stream.id === nameId);
                const name = nameValue != null ? nameValue.name : stream.name;
                return {
                    id: stream.id,
                    name,
                };
            }),
        };
        this.widgetUpdated.emit(configUpdate);
    }
    render() {
        const isEnabled = this.duration != null;
        const points = this.getPoints();
        const pairs = streamPairs(this.dataStreams);
        const isMiniVersion = pairs.length > 1;
        return (h("div", { class: { tall: !this.collapseVertically } }, !isEnabled && (h("div", { class: "help-icon-container" }, h("sc-help-tooltip", { message: this.liveModeOnlyMessage }))), h("sc-grid", null, pairs.map(({ alarm, property }) => {
            const stream = alarm || property;
            if (stream == null) {
                return undefined;
            }
            const alarmPointWrapper = alarm && points.find(p => p.streamId === alarm.id);
            const propertyPointWrapper = property && points.find(p => p.streamId === property.id);
            const alarmPoint = alarmPointWrapper ? alarmPointWrapper.point : undefined;
            const propertyPoint = propertyPointWrapper ? propertyPointWrapper.point : undefined;
            const pointToEvaluateOn = alarmPoint || propertyPoint;
            const infoToEvaluateOn = alarm || property;
            const threshold = pointToEvaluateOn && infoToEvaluateOn && this.getBreachedThreshold(pointToEvaluateOn, infoToEvaluateOn);
            const alarmStream = alarm && this.rawData().find(s => s.id === alarm.id);
            const primaryStream = alarm ? alarmStream : property;
            return (h("sc-grid-tooltip", { title: title({ alarm, property }), propertyPoint: propertyPoint, alarmPoint: alarmPoint, breachedThreshold: threshold, isEnabled: isEnabled }, this.renderCell({
                isEnabled,
                trendStream: property,
                propertyStream: property,
                propertyPoint,
                alarmStream,
                alarmPoint,
                breachedThreshold: threshold,
                isEditing: this.isEditing,
                viewPort: { start: this.start, end: this.end },
                miniVersion: isMiniVersion,
                onChangeLabel: this.onChangeLabel,
                messageOverrides: this.messageOverrides,
                labelsConfig: this.labelsConfig,
                icon: threshold ? threshold.icon : undefined,
                valueColor: threshold ? threshold.color : undefined,
                error: primaryStream ? primaryStream.error : undefined,
                isLoading: primaryStream ? primaryStream.isLoading || false : false,
                isRefreshing: primaryStream ? primaryStream.isRefreshing || false : false,
            })));
        }))));
    }
    static get watchers() { return {
        "viewPort": ["onViewPortChange"]
    }; }
};
ScWidgetGrid.style = scWidgetGridCss;

export { ScWidgetGrid as sc_widget_grid };
