import { h, r as registerInstance } from './index-44bccbc7.js';
import { D as DATA_ALIGNMENT } from './constants-4b21170a.js';
import './dataConstants-a26ff694.js';
import './time-f374952b.js';
import { S as Scene } from './three.module-af3affdd.js';
import './predicates-ced25765.js';
import './_commonjsHelpers-8f072dc7.js';
import './index-07d230d4.js';
import './v4-ea64cdd5.js';
import { b as getNumberThresholds } from './utils-11cae6c8.js';
import { c as clipSpaceConversion, a as constructChartScene, n as numDataPoints, b as needsNewClipSpace } from './clipSpaceConversion-16977037.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import { P as POINT_MESH_INDEX, p as pointMesh, N as NUM_POSITION_COMPONENTS, u as updatePointMesh } from './pointMesh-b470027f.js';
import { D as DEFAULT_CHART_CONFIG } from './chartDefaults-c377c791.js';

const chartScene = ({ dataStreams, container, viewPort, minBufferSize, bufferFactor, onUpdate, thresholdOptions, thresholds, }) => {
    const scene = new Scene();
    const toClipSpace = clipSpaceConversion(viewPort);
    const numberThresholds = getNumberThresholds(thresholds);
    // Create and add meshes to the chart scene
    const meshList = [];
    meshList[POINT_MESH_INDEX] = pointMesh({
        dataStreams,
        minBufferSize,
        bufferFactor,
        toClipSpace,
        thresholdOptions,
        thresholds: numberThresholds,
    });
    meshList.forEach(mesh => scene.add(mesh));
    return constructChartScene({ scene, viewPort, container, toClipSpace, onUpdate });
};
const maxDataPointsRendered = (points) => points.geometry.attributes.position.array.length / NUM_POSITION_COMPONENTS;
const updateChartScene = ({ scene, dataStreams, chartSize, container, viewPort, hasDataChanged, bufferFactor, minBufferSize, onUpdate, thresholdOptions, thresholds, hasAnnotationChanged, }) => {
    const points = scene.scene.children[POINT_MESH_INDEX];
    // If the amount of data being sent to the chart scene surpasses the size of the buffers within the
    // chart scene, we must fully recreate the chart scene. This is a costly operation.
    const isDataOverflowingBuffer = maxDataPointsRendered(points) < numDataPoints(dataStreams);
    if (isDataOverflowingBuffer || needsNewClipSpace(viewPort, scene.toClipSpace) || hasAnnotationChanged) {
        return chartScene({
            dataStreams,
            chartSize,
            container,
            viewPort,
            minBufferSize,
            bufferFactor,
            onUpdate,
            thresholdOptions,
            thresholds,
        });
    }
    if (hasDataChanged) {
        updatePointMesh(dataStreams, points, scene.toClipSpace);
    }
    // Return existing scene.
    return scene;
};

// The initial size of buffers. The larger this is, the more memory allocated up front per chart.
// The lower this number is, more likely that charts will have to re-initialize there buffers which is
// a slow operation (CPU bound).
const DEFAULT_MIN_BUFFER_SIZE = 1000;
const DEFAULT_BUFFER_FACTOR = 2;
const tooltip = (props) => (h("sc-tooltip", Object.assign({}, props, { visualizesAlarms: false, supportString: false, dataAlignment: DATA_ALIGNMENT.EITHER })));
const ScScatterChart = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.gestures = true;
        /** Status */
        this.isEditing = false;
        /** Memory Management */
        this.bufferFactor = DEFAULT_BUFFER_FACTOR;
        this.minBufferSize = DEFAULT_MIN_BUFFER_SIZE;
    }
    render() {
        return (h("sc-size-provider", { size: this.size, renderFunc: (rect) => (h("sc-webgl-base-chart", { axis: this.axis, gestures: this.gestures, configId: this.widgetId, requestData: this.requestData, legend: this.legend, annotations: this.annotations, trends: this.trends, updateChartScene: updateChartScene, createChartScene: chartScene, size: Object.assign(Object.assign(Object.assign({}, DEFAULT_CHART_CONFIG.size), this.size), rect), dataStreams: this.dataStreams, alarms: this.alarms, viewPort: this.viewPort, minBufferSize: this.minBufferSize, bufferFactor: this.bufferFactor, isEditing: this.isEditing, tooltip: tooltip, supportString: false, visualizesAlarms: false, messageOverrides: this.messageOverrides })) }));
    }
};

export { ScScatterChart as sc_scatter_chart };
