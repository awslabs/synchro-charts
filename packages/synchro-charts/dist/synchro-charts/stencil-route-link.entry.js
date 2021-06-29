import { r as registerInstance, h, g as getElement } from './index-44bccbc7.js';
import { m as matchPath } from './match-path-8f04732b.js';
import './location-utils-eae921c1.js';
import { i as isModifiedEvent } from './dom-utils-e7b9691d.js';
import { A as ActiveRouter } from './active-router-36310105.js';

const getUrl = (url, root) => {
    // Don't allow double slashes
    if (url.charAt(0) == '/' && root.charAt(root.length - 1) == '/') {
        return root.slice(0, root.length - 1) + url;
    }
    return root + url;
};
const RouteLink = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.unsubscribe = () => { return; };
        this.activeClass = 'link-active';
        this.exact = false;
        this.strict = true;
        /**
          *  Custom tag to use instead of an anchor
          */
        this.custom = 'a';
        this.match = null;
    }
    componentWillLoad() {
        this.computeMatch();
    }
    // Identify if the current route is a match.
    computeMatch() {
        if (this.location) {
            this.match = matchPath(this.location.pathname, {
                path: this.urlMatch || this.url,
                exact: this.exact,
                strict: this.strict
            });
        }
    }
    handleClick(e) {
        if (isModifiedEvent(e) || !this.history || !this.url || !this.root) {
            return;
        }
        e.preventDefault();
        return this.history.push(getUrl(this.url, this.root));
    }
    // Get the URL for this route link without the root from the router
    render() {
        let anchorAttributes = {
            class: {
                [this.activeClass]: this.match !== null,
            },
            onClick: this.handleClick.bind(this)
        };
        if (this.anchorClass) {
            anchorAttributes.class[this.anchorClass] = true;
        }
        if (this.custom === 'a') {
            anchorAttributes = Object.assign({}, anchorAttributes, { href: this.url, title: this.anchorTitle, role: this.anchorRole, tabindex: this.anchorTabIndex, 'aria-haspopup': this.ariaHaspopup, id: this.anchorId, 'aria-posinset': this.ariaPosinset, 'aria-setsize': this.ariaSetsize, 'aria-label': this.ariaLabel });
        }
        return (h(this.custom, Object.assign({}, anchorAttributes), h("slot", null)));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "location": ["computeMatch"]
    }; }
};
ActiveRouter.injectProps(RouteLink, [
    'history',
    'location',
    'root'
]);

export { RouteLink as stencil_route_link };
