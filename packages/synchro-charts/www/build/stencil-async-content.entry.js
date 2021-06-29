import { r as registerInstance, h } from './index-44bccbc7.js';

const AsyncContent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.content = '';
    }
    componentWillLoad() {
        if (this.documentLocation != null) {
            return this.fetchNewContent(this.documentLocation);
        }
    }
    fetchNewContent(newDocumentLocation) {
        return fetch(newDocumentLocation)
            .then(response => response.text())
            .then(data => {
            this.content = data;
        });
    }
    render() {
        return (h("div", { innerHTML: this.content }));
    }
    static get watchers() { return {
        "documentLocation": ["fetchNewContent"]
    }; }
};

export { AsyncContent as stencil_async_content };
