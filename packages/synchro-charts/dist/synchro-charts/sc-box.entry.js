import { r as registerInstance, h } from './index-44bccbc7.js';

const ScBox = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.size = { width: 0, height: 0 };
    }
    render() {
        const dataProps = this.someObject
            ? Object.keys(this.someObject).reduce((obj, key) => (Object.assign(Object.assign({}, obj), { [`data-${key}`]: this.someObject[key] })), {})
            : {};
        return (h("div", Object.assign({}, dataProps, { class: "box-container", style: {
                boxSizing: 'border-box',
                border: '1px solid black',
                backgroundColor: 'lightgrey',
                width: `${this.size.width}px`,
                height: `${this.size.height}px`,
            } }), h("ul", null, h("li", null, this.size.width, " width"), h("li", null, this.size.height, " height"))));
    }
};

export { ScBox as sc_box };
