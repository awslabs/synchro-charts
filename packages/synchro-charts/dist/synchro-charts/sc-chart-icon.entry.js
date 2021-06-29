import { h, r as registerInstance } from './index-44bccbc7.js';
import { a as StatusIcon } from './constants-4b21170a.js';

/* eslint-disable max-len */
const DEFAULT_SIZE_PX = 16;
const icons = {
    normal(color, size = DEFAULT_SIZE_PX) {
        return (h("svg", { width: `${size}px`, height: `${size}px`, viewBox: "0 0 16 16", fill: color ? `${color}` : '#1d8102' },
            h("path", { d: "M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" }),
            h("path", { d: "M7 8.6l-2-2L3.6 8 7 11.4l4.9-4.9-1.4-1.4z" })));
    },
    active(color, size = DEFAULT_SIZE_PX) {
        return (h("svg", { width: `${size}px`, height: `${size}px`, fill: color ? `${color}` : '#d13212', viewBox: "0 0 16 16" },
            h("g", { fill: "none", "fill-rule": "evenodd" },
                h("circle", { cx: "8", cy: "8", r: "7", stroke: color ? `${color}` : '#d13212', "stroke-width": "2" }),
                h("g", { transform: "translate(7 4)" },
                    h("mask", { id: "b", fill: "#fff" },
                        h("path", { id: "a", d: "M2.00129021 6v2h-2V6h2zm0-6v5h-2V0h2z" })),
                    h("g", { mask: "url(#b)" },
                        h("path", { fill: color ? `${color}` : '#d13212', d: "M-7-5H9v16H-7z" }))))));
    },
    acknowledged(color, size = DEFAULT_SIZE_PX) {
        return (h("svg", { width: `${size}px`, height: `${size}px`, viewBox: "0 0 16 16", stroke: color ? `${color}` : '#3184c2' },
            h("path", { fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M2 12.286h5.143L8.857 14l1.714-1.714H14V2H2v10.286z" }),
            h("path", { fill: "none", "stroke-linecap": "round", "stroke-width": "2", "stroke-miterlimit": "10", d: "M4.99 7H5v.01h-.01zM7.99 7H8v.01h-.01zM10.99 7H11v.01h-.01z" })));
    },
    disabled(color, size = DEFAULT_SIZE_PX) {
        return (h("svg", { width: `${size}px`, height: `${size}px`, viewBox: "0 0 16 16", stroke: color ? `${color}` : '#687078' },
            h("g", { fill: "none", "stroke-width": "2" },
                h("circle", { cx: "8", cy: "8", r: "7", "stroke-linejoin": "round" }),
                h("path", { "stroke-linecap": "square", "stroke-miterlimit": "10", d: "M11 8H5" }))));
    },
    latched(color, size = DEFAULT_SIZE_PX) {
        return (h("svg", { width: `${size}px`, height: `${size}px`, viewBox: "0 0 16 16", fill: color ? `${color}` : '#f89256' },
            h("path", { d: "M15.9 14.6l-7-14c-.3-.7-1.5-.7-1.8 0l-7 14c-.2.3-.1.7 0 1 .2.2.6.4.9.4h14c.3 0 .7-.2.9-.5.1-.3.1-.6 0-.9zM2.6 14L8 3.2 13.4 14H2.6z" }),
            h("path", { d: "M7 11v2h2v-2zM7 6h2v4H7z" })));
    },
    snoozed(color, size = DEFAULT_SIZE_PX) {
        return (h("svg", { width: `${size}px`, height: `${size}px`, viewBox: "0 0 16 16", stroke: color ? `${color}` : '#879596' },
            h("g", { fill: "none", "stroke-width": "2" },
                h("circle", { cx: "8", cy: "8", r: "7", "stroke-linejoin": "round" }),
                h("path", { "stroke-linecap": "square", "stroke-miterlimit": "10", d: "M8 5v4H5" }))));
    },
    error(color, size = DEFAULT_SIZE_PX) {
        return (h("svg", { width: `${size}px`, height: `${size}px`, viewBox: "0 0 16 16", fill: color ? `${color}` : '#FF0000', "data-test-tag": "error" },
            h("path", { class: "st4", d: "M13.7 2.3C12.1.8 10.1 0 8 0S3.9.8 2.3 2.3C.8 3.9 0 5.9 0 8s.8 4.1 2.3 5.7C3.9 15.2 5.9 16 8 16s4.1-.8 5.7-2.3C15.2 12.1 16 10.1 16 8s-.8-4.1-2.3-5.7zm-1.5 9.9C11.1 13.4 9.6 14 8 14s-3.1-.6-4.2-1.8S2 9.6 2 8s.6-3.1 1.8-4.2S6.4 2 8 2s3.1.6 4.2 1.8S14 6.4 14 8s-.6 3.1-1.8 4.2z" }),
            h("path", { class: "st4", d: "M10.1 4.5L8 6.6 5.9 4.5 4.5 5.9 6.6 8l-2.1 2.1 1.4 1.4L8 9.4l2.1 2.1 1.4-1.4L9.4 8l2.1-2.1z" })));
    },
};
const getIcons = (name, color, size) => {
    if (icons[name]) {
        return icons[name](color, size);
    }
    /* eslint-disable-next-line no-console */
    console.warn(`Invalid status icon requested: ${name}`);
    return undefined;
};

const scChartIconCss = ".sc-chart-icon{position:relative;margin-right:3px;top:2px;padding:0.5rem 0;display:inline}";

const ScChartIcon = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.name = StatusIcon.NORMAL;
    }
    render() {
        return h("div", { class: "sc-chart-icon" }, getIcons(this.name, this.color, this.size));
    }
};
ScChartIcon.style = scChartIconCss;

export { ScChartIcon as sc_chart_icon };
