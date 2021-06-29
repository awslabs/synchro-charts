import { r as registerInstance, h } from './index-44bccbc7.js';

const scExpandableInputCss = "sc-expandable-input .sc-expandable-input{display:inline-block;background:none;color:inherit;word-break:break-word;margin-top:3px;min-width:20px;text-overflow:ellipsis;border:none;border-bottom:var(--border-width) solid var(--polaris-gray-400)}sc-expandable-input .sc-expandable-input.disabled{outline:none;border-bottom-color:rgba(0, 0, 0, 0)}";

const ScExpandableInput = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.onChange = (e) => {
            const span = e.target;
            this.onValueChange(span.innerText);
        };
    }
    render() {
        const { value, isDisabled = false } = this;
        return (h("span", { "data-test-tag": "expandable-input", contentEditable: !isDisabled, class: `sc-expandable-input aws-util-font-size-1 ${isDisabled ? 'disabled' : ''}`,
            // spellCheck={('false' as unknown) as boolean}
            onBlur: this.onChange }, value));
    }
};
ScExpandableInput.style = scExpandableInputCss;

export { ScExpandableInput as sc_expandable_input };
