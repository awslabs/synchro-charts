import { r as registerInstance, h, g as getElement } from './index-44bccbc7.js';
import { m as matchPath, a as matchesAreEqual } from './match-path-8f04732b.js';
import './location-utils-eae921c1.js';
import { A as ActiveRouter } from './active-router-36310105.js';

const routeCss = "stencil-route.inactive{display:none}";

const Route = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.group = null;
        this.match = null;
        this.componentProps = {};
        this.exact = false;
        this.scrollOnNextRender = false;
        this.previousMatch = null;
    }
    // Identify if the current route is a match.
    computeMatch(newLocation) {
        const isGrouped = this.group != null || (this.el.parentElement != null && this.el.parentElement.tagName.toLowerCase() === 'stencil-route-switch');
        if (!newLocation || isGrouped) {
            return;
        }
        this.previousMatch = this.match;
        return this.match = matchPath(newLocation.pathname, {
            path: this.url,
            exact: this.exact,
            strict: true
        });
    }
    async loadCompleted() {
        let routeViewOptions = {};
        if (this.history && this.history.location.hash) {
            routeViewOptions = {
                scrollToId: this.history.location.hash.substr(1)
            };
        }
        else if (this.scrollTopOffset) {
            routeViewOptions = {
                scrollTopOffset: this.scrollTopOffset
            };
        }
        // After all children have completed then tell switch
        // the provided callback will get executed after this route is in view
        if (typeof this.componentUpdated === 'function') {
            this.componentUpdated(routeViewOptions);
            // If this is an independent route and it matches then routes have updated.
            // If the only change to location is a hash change then do not scroll.
        }
        else if (this.match && !matchesAreEqual(this.match, this.previousMatch) && this.routeViewsUpdated) {
            this.routeViewsUpdated(routeViewOptions);
        }
    }
    async componentDidUpdate() {
        await this.loadCompleted();
    }
    async componentDidLoad() {
        await this.loadCompleted();
    }
    render() {
        // If there is no activeRouter then do not render
        // Check if this route is in the matching URL (for example, a parent route)
        if (!this.match || !this.history) {
            return null;
        }
        // component props defined in route
        // the history api
        // current match data including params
        const childProps = Object.assign({}, this.componentProps, { history: this.history, match: this.match });
        // If there is a routerRender defined then use
        // that and pass the component and component props with it.
        if (this.routeRender) {
            return this.routeRender(Object.assign({}, childProps, { component: this.component }));
        }
        if (this.component) {
            const ChildComponent = this.component;
            return (h(ChildComponent, Object.assign({}, childProps)));
        }
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "location": ["computeMatch"]
    }; }
};
ActiveRouter.injectProps(Route, [
    'location',
    'history',
    'historyType',
    'routeViewsUpdated'
]);
Route.style = routeCss;

export { Route as stencil_route };
