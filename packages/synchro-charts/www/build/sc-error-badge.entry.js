import { r as registerInstance, h } from './index-44bccbc7.js';

const scErrorBadgeCss = "sc-error-badge div{display:flex;padding-left:1.4286em;line-height:1.4286em;color:var(--error-badge-font-color, #6a7070)}sc-error-badge .warning-symbol{font-size:2rem;padding-right:var(--margin-small);font-weight:bold;color:var(--error-badge-warning-color, #fa3232)}";

const ScErrorBadge = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h("div", { "data-test-tag": "error" }, h("span", { class: "warning-symbol" }, "\u26A0"), h("slot", null)));
    }
};
ScErrorBadge.style = scErrorBadgeCss;

export { ScErrorBadge as sc_error_badge };
