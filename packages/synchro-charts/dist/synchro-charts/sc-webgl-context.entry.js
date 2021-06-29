import { r as registerInstance, h, g as getElement } from './index-44bccbc7.js';
import './dataConstants-a26ff694.js';
import './three.module-af3affdd.js';
import { w as webGLRenderer } from './webglContext-25ec9599.js';
import './predicates-ced25765.js';

const scWebglContextCss = "sc-webgl-context{--scroll-bar-size:16px;width:100%;height:100vh;position:absolute;top:0;left:0;z-index:1;pointer-events:none}.webgl-context-canvas{position:absolute;left:0;top:0;width:calc(100vw - var(--scroll-bar-size));height:calc(100vh - var(--scroll-bar-size));display:block;pointer-events:none;z-index:10}";

const ScWebglContext = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    componentDidLoad() {
        const canvas = this.el.querySelector('canvas');
        webGLRenderer.initRendering(canvas);
    }
    render() {
        return h("canvas", { class: "webgl-context-canvas" });
    }
    get el() { return getElement(this); }
};
ScWebglContext.style = scWebglContextCss;

export { ScWebglContext as sc_webgl_context };
