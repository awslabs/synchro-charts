import { r as registerInstance, h, g as getElement } from './index-44bccbc7.js';
import './constants-4b21170a.js';
import { D as DataType } from './dataConstants-a26ff694.js';
import { D as DAY_IN_MS } from './time-f374952b.js';
import './three.module-af3affdd.js';
import { w as webGLRenderer } from './webglContext-25ec9599.js';
import './predicates-ced25765.js';
import { c as chartScene, H as HEIGHT } from './chartScene-3b908d88.js';
import './_commonjsHelpers-8f072dc7.js';
import './index-07d230d4.js';
import './v4-ea64cdd5.js';
import './utils-11cae6c8.js';
import './clipSpaceConversion-16977037.js';
import './index-25df4638.js';
import './number-0c56420d.js';
import './getDistanceFromDuration-5c7da5d2.js';
import { C as CHART_SIZE } from './chartSize-6ceb3800.js';

// viewport boundaries
const X_MIN = new Date(2000, 0, 0);
const X_MAX = new Date(2000, 0, 1);
const WIDTH = X_MAX.getTime() - X_MIN.getTime();
const TEST_DATA_POINT_1 = {
    x: X_MIN.getTime() + WIDTH / 3,
    y: 123,
};
const SingleColoredStatus = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentDidLoad() {
        const container = this.el.querySelector('#test-container');
        const scene = chartScene({
            alarms: { expires: DAY_IN_MS },
            viewPort: {
                start: X_MIN,
                end: X_MAX,
                yMin: 0,
                yMax: HEIGHT,
            },
            dataStreams: [
                {
                    id: 'test-stream',
                    name: 'test-stream-name',
                    color: 'red',
                    aggregates: {
                        [DAY_IN_MS]: [TEST_DATA_POINT_1],
                    },
                    data: [],
                    resolution: DAY_IN_MS,
                    dataType: DataType.NUMBER,
                },
            ],
            container,
            chartSize: CHART_SIZE,
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

export { SingleColoredStatus as single_colored_status };
