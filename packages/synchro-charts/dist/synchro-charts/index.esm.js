export { C as COMPARISON_OPERATOR, D as DATA_ALIGNMENT, L as LEGEND_POSITION, b as STATUS_ICONS, S as ScaleType, a as StatusIcon } from './constants-4b21170a.js';
export { C as ChartType, D as DataType, S as StreamType, T as TREND_TYPE } from './dataConstants-a26ff694.js';
export { c as NO_DATA_PRESENT_HEADER, d as NO_DATA_PRESENT_SUB_HEADER, a as NO_DATA_STREAMS_PRESENT_HEADER, b as NO_DATA_STREAMS_PRESENT_SUB_HEADER, N as NO_VALUE_PRESENT } from './terms-d11f73d5.js';
import { S as SECOND_IN_MS } from './time-f374952b.js';

const MAX_FPS_TRACKED = 80;
const initFPSMetering = () => {
    let trackedFPS = [];
    let lastLoop = Date.now();
    let thisLoop = Date.now();
    let framesProcessed = 0;
    const loop = setInterval(() => {
        framesProcessed += 1;
    }, SECOND_IN_MS / MAX_FPS_TRACKED);
    const updateFPS = setInterval(() => {
        thisLoop = Date.now();
        const duration = (thisLoop - lastLoop) / SECOND_IN_MS;
        trackedFPS.push(framesProcessed / Math.max(duration, 0.005));
        lastLoop = thisLoop;
        framesProcessed = 0;
    }, SECOND_IN_MS / 4);
    return {
        reset: () => {
            framesProcessed = 0;
            thisLoop = Date.now();
            lastLoop = Date.now();
            trackedFPS = [];
        },
        fps: () => {
            const sortedFPS = [...trackedFPS].sort();
            const len = sortedFPS.length;
            const mid = Math.ceil(len / 2);
            const median = len % 2 === 0 ? (sortedFPS[mid] + sortedFPS[mid - 1]) / 2 : sortedFPS[mid - 1];
            const sum = sortedFPS.reduce((total, num) => total + num, 0);
            const average = sum / len;
            trackedFPS = [];
            return { average, median };
        },
        stop: () => {
            clearInterval(loop);
            clearInterval(updateFPS);
        },
    };
};

export { initFPSMetering };
