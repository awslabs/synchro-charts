import { r as registerInstance, h, g as getElement } from './index-44bccbc7.js';
import './constants-4b21170a.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import './time-f374952b.js';
import './three.module-af3affdd.js';
import { w as webGLRenderer } from './webglContext-25ec9599.js';
import './predicates-ced25765.js';
import './_commonjsHelpers-8f072dc7.js';
import './index-07d230d4.js';
import './v4-ea64cdd5.js';
import './utils-11cae6c8.js';
import './clipSpaceConversion-16977037.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import { C as CHART_SIZE } from './chartSize-6ceb3800.js';
import './pointMesh-b470027f.js';
import { c as chartScene } from './chartScene-1f83081d.js';

// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const Y_MIN = 0;
const Y_MAX = 100;
const WIDTH = X_MAX.getTime() - X_MIN.getTime();
const TEST_DATA_POINT_1 = {
    x: X_MIN.getTime() + WIDTH / 3,
    y: (Y_MIN + Y_MAX) / 2,
};
const TEST_DATA_POINT_2 = {
    x: X_MIN.getTime() + WIDTH * (2 / 3),
    y: (Y_MIN + Y_MAX) / 2,
};
const ScStraightLineSegment = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentDidLoad() {
        const container = this.el.querySelector('#test-container');
        const scene = chartScene({
            viewPort: {
                start: X_MIN,
                end: X_MAX,
                yMin: Y_MIN,
                yMax: Y_MAX,
            },
            dataStreams: [
                {
                    id: 'test-stream',
                    name: 'test-stream-name',
                    color: 'purple',
                    data: [TEST_DATA_POINT_1, TEST_DATA_POINT_2],
                    resolution: 0,
                    dataType: DataType.NUMBER,
                },
            ],
            chartSize: CHART_SIZE,
            container,
            minBufferSize: 100,
            bufferFactor: 2,
            thresholdOptions: {
                showColor: false,
            },
            thresholds: [],
        });
        webGLRenderer.addChartScene(scene);
        const rect = container.getBoundingClientRect();
        webGLRenderer.setChartRect(scene.id, Object.assign({ density: 1 }, rect.toJSON()));
    }
    render() {
        return (h("sc-webgl-context", null, h("div", { id: "test-container", style: { width: `${CHART_SIZE.width}px`, height: `${CHART_SIZE.height}px` } })));
    }
    get el() { return getElement(this); }
};

export { ScStraightLineSegment as sc_straight_line_segment_colored };
