(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{862:function(t,e,n){"use strict";n.r(e),n.d(e,"sc_app",(function(){return l})),n.d(e,"stencil_route",(function(){return u})),n.d(e,"stencil_route_switch",(function(){return p})),n.d(e,"stencil_router",(function(){return O}));var r=n(13),o=n(994),s=n(995),a=n(987),i=function(t,e,n,r){return new(n||(n=Promise))((function(o,s){function a(t){try{c(r.next(t))}catch(t){s(t)}}function i(t){try{c(r.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,i)}c((r=r.apply(t,e||[])).next())}))},c=function(t,e){var n,r,o,s,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return s={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function i(t){return function(e){return c([t,e])}}function c(s){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&s[0]?r.return:s[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,s[1])).done)return o;switch(r=0,o&&(s=[2&s[0],o.value]),s[0]){case 0:case 1:o=s;break;case 4:return a.label++,{value:s[1],done:!1};case 5:a.label++,r=s[1],s=[0];continue;case 7:s=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==s[0]&&2!==s[0])){a=0;continue}if(3===s[0]&&(!o||s[1]>o[0]&&s[1]<o[3])){a.label=s[1];break}if(6===s[0]&&a.label<o[1]){a.label=o[1],o=s;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(s);break}o[2]&&a.ops.pop(),a.trys.pop();continue}s=e.call(t,a)}catch(t){s=[6,t],r=0}finally{n=o=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}},l=function(){function t(t){Object(r.l)(this,t)}return t.prototype.render=function(){return Object(r.j)("stencil-router",null,Object(r.j)("stencil-route-switch",{scrollTopOffset:0},o.a.map((function(t){return Object(r.j)("stencil-route",{url:t.url,component:t.component,exact:!0})}))))},t}(),u=function(){function t(t){Object(r.l)(this,t),this.group=null,this.match=null,this.componentProps={},this.exact=!1,this.scrollOnNextRender=!1,this.previousMatch=null}return t.prototype.computeMatch=function(t){var e=null!=this.group||null!=this.el.parentElement&&"stencil-route-switch"===this.el.parentElement.tagName.toLowerCase();if(t&&!e)return this.previousMatch=this.match,this.match=Object(s.m)(t.pathname,{path:this.url,exact:this.exact,strict:!0})},t.prototype.loadCompleted=function(){return i(this,void 0,void 0,(function(){var t;return c(this,(function(e){return t={},this.history&&this.history.location.hash?t={scrollToId:this.history.location.hash.substr(1)}:this.scrollTopOffset&&(t={scrollTopOffset:this.scrollTopOffset}),"function"==typeof this.componentUpdated?this.componentUpdated(t):this.match&&!Object(s.a)(this.match,this.previousMatch)&&this.routeViewsUpdated&&this.routeViewsUpdated(t),[2]}))}))},t.prototype.componentDidUpdate=function(){return i(this,void 0,void 0,(function(){return c(this,(function(t){switch(t.label){case 0:return[4,this.loadCompleted()];case 1:return t.sent(),[2]}}))}))},t.prototype.componentDidLoad=function(){return i(this,void 0,void 0,(function(){return c(this,(function(t){switch(t.label){case 0:return[4,this.loadCompleted()];case 1:return t.sent(),[2]}}))}))},t.prototype.render=function(){if(!this.match||!this.history)return null;var t=Object.assign({},this.componentProps,{history:this.history,match:this.match});if(this.routeRender)return this.routeRender(Object.assign({},t,{component:this.component}));if(this.component){var e=this.component;return Object(r.j)(e,Object.assign({},t))}},Object.defineProperty(t.prototype,"el",{get:function(){return Object(r.i)(this)},enumerable:!1,configurable:!0}),Object.defineProperty(t,"watchers",{get:function(){return{location:["computeMatch"]}},enumerable:!1,configurable:!0}),t}();a.a.injectProps(u,["location","history","historyType","routeViewsUpdated"]),u.style="stencil-route.inactive{display:none}";var h=function(t){return"STENCIL-ROUTE"===t.tagName},p=function(){function t(t){Object(r.l)(this,t),this.group=((1e17*Math.random()).toString().match(/.{4}/g)||[]).join("-"),this.subscribers=[],this.queue=Object(r.f)(this,"queue")}return t.prototype.componentWillLoad=function(){null!=this.location&&this.regenerateSubscribers(this.location)},t.prototype.regenerateSubscribers=function(t){return i(this,void 0,void 0,(function(){var e,n,r=this;return c(this,(function(o){return null==t?[2]:(e=-1,this.subscribers=Array.prototype.slice.call(this.el.children).filter(h).map((function(n,r){var o=function(t,e,n){return Object(s.m)(t,{path:e,exact:n,strict:!0})}(t.pathname,n.url,n.exact);return o&&-1===e&&(e=r),{el:n,match:o}})),-1===e?[2]:this.activeIndex===e?(this.subscribers[e].el.match=this.subscribers[e].match,[2]):(this.activeIndex=e,n=this.subscribers[this.activeIndex],this.scrollTopOffset&&(n.el.scrollTopOffset=this.scrollTopOffset),n.el.group=this.group,n.el.match=n.match,n.el.componentUpdated=function(t){r.queue.write((function(){r.subscribers.forEach((function(t,e){if(t.el.componentUpdated=void 0,e===r.activeIndex)return t.el.style.display="";r.scrollTopOffset&&(t.el.scrollTopOffset=r.scrollTopOffset),t.el.group=r.group,t.el.match=null,t.el.style.display="none"}))})),r.routeViewsUpdated&&r.routeViewsUpdated(Object.assign({scrollTopOffset:r.scrollTopOffset},t))},[2]))}))}))},t.prototype.render=function(){return Object(r.j)("slot",null)},Object.defineProperty(t.prototype,"el",{get:function(){return Object(r.i)(this)},enumerable:!1,configurable:!0}),Object.defineProperty(t,"watchers",{get:function(){return{location:["regenerateSubscribers"]}},enumerable:!1,configurable:!0}),t}();a.a.injectProps(p,["location","routeViewsUpdated"]);var d=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];t||console.warn.apply(console,e)},f=function(){var t,e=[];return{setPrompt:function(e){return d(null==t,"A history supports only one prompt at a time"),t=e,function(){t===e&&(t=null)}},confirmTransitionTo:function(e,n,r,o){if(null!=t){var s="function"==typeof t?t(e,n):t;"string"==typeof s?"function"==typeof r?r(s,o):(d(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),o(!0)):o(!1!==s)}else o(!0)},appendListener:function(t){var n=!0,r=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];n&&t.apply(void 0,e)};return e.push(r),function(){n=!1,e=e.filter((function(t){return t!==r}))}},notifyListeners:function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];e.forEach((function(e){return e.apply(void 0,t)}))}}},m="popstate",b="hashchange",g="hashchange",y={hashbang:{encodePath:function(t){return"!"===t.charAt(0)?t:"!/"+Object(s.o)(t)},decodePath:function(t){return"!"===t.charAt(0)?t.substr(1):t}},noslash:{encodePath:s.o,decodePath:s.e},slash:{encodePath:s.e,decodePath:s.e}},w=function(t,e){var n=0==t.pathname.indexOf(e)?"/"+t.pathname.slice(e.length):t.pathname;return Object.assign({},t,{pathname:n})},v={browser:function(t,e){void 0===e&&(e={});var n=!1,r=t.history,o=t.location,a=t.navigator,i=Object(s.b)(t),c=!Object(s.c)(a),l=function(t,e){void 0===e&&(e="scrollPositions");var n=new Map,r=function(e,r){if(n.set(e,r),Object(s.r)(t,"sessionStorage")){var o=[];n.forEach((function(t,e){o.push([e,t])})),t.sessionStorage.setItem("scrollPositions",JSON.stringify(o))}};if(Object(s.r)(t,"sessionStorage")){var o=t.sessionStorage.getItem(e);n=o?new Map(JSON.parse(o)):n}return"scrollRestoration"in t.history&&(history.scrollRestoration="manual"),{set:r,get:function(t){return n.get(t)},has:function(t){return n.has(t)},capture:function(e){r(e,[t.scrollX,t.scrollY])}}}(t),u=null!=e.forceRefresh&&e.forceRefresh,h=null!=e.getUserConfirmation?e.getUserConfirmation:s.k,p=null!=e.keyLength?e.keyLength:6,g=e.basename?Object(s.d)(Object(s.e)(e.basename)):"",y=function(){try{return t.history.state||{}}catch(t){return{}}},w=function(t){var e=(t=t||{}).key,n=t.state,r=o.pathname+o.search+o.hash;return d(!g||Object(s.h)(r,g),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+r+'" to begin with "'+g+'".'),g&&(r=Object(s.i)(r,g)),Object(s.f)(r,n,e||Object(s.g)(p))},v=f(),O=function(t){l.capture(I.location.key),Object.assign(I,t),I.location.scrollPosition=l.get(I.location.key),I.length=r.length,v.notifyListeners(I.location,I.action)},j=function(t){Object(s.l)(a,t)||P(w(t.state))},x=function(){P(w(y()))},P=function(t){n?(n=!1,O()):v.confirmTransitionTo(t,"POP",h,(function(e){e?O({action:"POP",location:t}):T(t)}))},T=function(t){var e=I.location,r=A.indexOf(e.key),o=A.indexOf(t.key);-1===r&&(r=0),-1===o&&(o=0);var s=r-o;s&&(n=!0,L(s))},k=w(y()),A=[k.key],E=0,S=!1,U=function(t){return g+Object(s.j)(t)},L=function(t){r.go(t)},R=function(e){1===(E+=e)?(t.addEventListener(m,j),c&&t.addEventListener(b,x)):0===E&&(t.removeEventListener(m,j),c&&t.removeEventListener(b,x))},I={length:r.length,action:"POP",location:k,createHref:U,push:function(t,e){d(!("object"==typeof t&&void 0!==t.state&&void 0!==e),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var n="PUSH",a=Object(s.f)(t,e,Object(s.g)(p),I.location);v.confirmTransitionTo(a,n,h,(function(t){if(t){var e=U(a),s=a.key,c=a.state;if(i)if(r.pushState({key:s,state:c},"",e),u)o.href=e;else{var l=A.indexOf(I.location.key),h=A.slice(0,-1===l?0:l+1);h.push(a.key),A=h,O({action:n,location:a})}else d(void 0===c,"Browser history cannot push state in browsers that do not support HTML5 history"),o.href=e}}))},replace:function(t,e){d(!("object"==typeof t&&void 0!==t.state&&void 0!==e),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var n="REPLACE",a=Object(s.f)(t,e,Object(s.g)(p),I.location);v.confirmTransitionTo(a,n,h,(function(t){if(t){var e=U(a),s=a.key,c=a.state;if(i)if(r.replaceState({key:s,state:c},"",e),u)o.replace(e);else{var l=A.indexOf(I.location.key);-1!==l&&(A[l]=a.key),O({action:n,location:a})}else d(void 0===c,"Browser history cannot replace state in browsers that do not support HTML5 history"),o.replace(e)}}))},go:L,goBack:function(){return L(-1)},goForward:function(){return L(1)},block:function(t){void 0===t&&(t="");var e=v.setPrompt(t);return S||(R(1),S=!0),function(){return S&&(S=!1,R(-1)),e()}},listen:function(t){var e=v.appendListener(t);return R(1),function(){R(-1),e()}},win:t};return I},hash:function(t,e){void 0===e&&(e={});var n=!1,r=null,o=0,a=!1,i=t.location,c=t.history,l=Object(s.n)(t.navigator),u=null!=e.keyLength?e.keyLength:6,h=e.getUserConfirmation,p=void 0===h?s.k:h,m=e.hashType,b=void 0===m?"slash":m,w=e.basename?Object(s.d)(Object(s.e)(e.basename)):"",v=y[b],O=v.encodePath,j=v.decodePath,x=function(){var t=i.href,e=t.indexOf("#");return-1===e?"":t.substring(e+1)},P=function(t){return i.hash=t},T=function(t){var e=i.href.indexOf("#");i.replace(i.href.slice(0,e>=0?e:0)+"#"+t)},k=function(){var t=j(x());return d(!w||Object(s.h)(t,w),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+t+'" to begin with "'+w+'".'),w&&(t=Object(s.i)(t,w)),Object(s.f)(t,void 0,Object(s.g)(u))},A=f(),E=function(t){Object.assign(V,t),V.length=c.length,A.notifyListeners(V.location,V.action)},S=function(){var t=x(),e=O(t);if(t!==e)T(e);else{var o=k(),a=V.location;if(!n&&Object(s.p)(a,o))return;if(r===Object(s.j)(o))return;r=null,U(o)}},U=function(t){n?(n=!1,E()):A.confirmTransitionTo(t,"POP",p,(function(e){e?E({action:"POP",location:t}):L(t)}))},L=function(t){var e=V.location,r=M.lastIndexOf(Object(s.j)(e)),o=M.lastIndexOf(Object(s.j)(t));-1===r&&(r=0),-1===o&&(o=0);var a=r-o;a&&(n=!0,_(a))},R=x(),I=O(R);R!==I&&T(I);var C=k(),M=[Object(s.j)(C)],_=function(t){d(l,"Hash history go(n) causes a full page reload in this browser"),c.go(t)},H=function(t,e){1===(o+=e)?t.addEventListener(g,S):0===o&&t.removeEventListener(g,S)},V={length:c.length,action:"POP",location:C,createHref:function(t){return"#"+O(w+Object(s.j)(t))},push:function(t,e){d(void 0===e,"Hash history cannot push state; it is ignored");var n="PUSH",o=Object(s.f)(t,void 0,Object(s.g)(u),V.location);A.confirmTransitionTo(o,n,p,(function(t){if(t){var e=Object(s.j)(o),a=O(w+e);if(x()!==a){r=e,P(a);var i=M.lastIndexOf(Object(s.j)(V.location)),c=M.slice(0,-1===i?0:i+1);c.push(e),M=c,E({action:n,location:o})}else d(!1,"Hash history cannot PUSH the same path; a new entry will not be added to the history stack"),E()}}))},replace:function(t,e){d(void 0===e,"Hash history cannot replace state; it is ignored");var n="REPLACE",o=Object(s.f)(t,void 0,Object(s.g)(u),V.location);A.confirmTransitionTo(o,n,p,(function(t){if(t){var e=Object(s.j)(o),a=O(w+e);x()!==a&&(r=e,T(a));var i=M.indexOf(Object(s.j)(V.location));-1!==i&&(M[i]=e),E({action:n,location:o})}}))},go:_,goBack:function(){return _(-1)},goForward:function(){return _(1)},block:function(e){void 0===e&&(e="");var n=A.setPrompt(e);return a||(H(t,1),a=!0),function(){return a&&(a=!1,H(t,-1)),n()}},listen:function(e){var n=A.appendListener(e);return H(t,1),function(){H(t,-1),n()}},win:t};return V}},O=function(){function t(t){var e=this;Object(r.l)(this,t),this.root="/",this.historyType="browser",this.titleSuffix="",this.routeViewsUpdated=function(t){if(void 0===t&&(t={}),e.history&&t.scrollToId&&"browser"===e.historyType){var n=e.history.win.document.getElementById(t.scrollToId);if(n)return n.scrollIntoView()}e.scrollTo(t.scrollTopOffset||e.scrollTopOffset)},this.isServer=Object(r.f)(this,"isServer"),this.queue=Object(r.f)(this,"queue")}return t.prototype.componentWillLoad=function(){var t=this;this.history=v[this.historyType](this.el.ownerDocument.defaultView),this.history.listen((function(e){e=w(e,t.root),t.location=e})),this.location=w(this.history.location,this.root)},t.prototype.scrollTo=function(t){var e=this.history;if(null!=t&&!this.isServer&&e)return"POP"===e.action&&Array.isArray(e.location.scrollPosition)?this.queue.write((function(){e&&e.location&&Array.isArray(e.location.scrollPosition)&&e.win.scrollTo(e.location.scrollPosition[0],e.location.scrollPosition[1])})):this.queue.write((function(){e.win.scrollTo(0,t)}))},t.prototype.render=function(){if(this.location&&this.history){var t={historyType:this.historyType,location:this.location,titleSuffix:this.titleSuffix,root:this.root,history:this.history,routeViewsUpdated:this.routeViewsUpdated};return Object(r.j)(a.a.Provider,{state:t},Object(r.j)("slot",null))}},Object.defineProperty(t.prototype,"el",{get:function(){return Object(r.i)(this)},enumerable:!1,configurable:!0}),t}()},987:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(13),o=function(t,e){var n=new Map,r=t,o=function(t,e){Array.isArray(t)?function(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;var r=Array(t),o=0;for(e=0;e<n;e++)for(var s=arguments[e],a=0,i=s.length;a<i;a++,o++)r[o]=s[a];return r}(t).forEach((function(t){e[t]=r[t]})):e[t]=Object.assign({},r)},s=function(t,e){return n.has(t)||(n.set(t,e),o(e,t)),function(){n.has(t)&&n.delete(t)}};return{Provider:function(t,e){var s=t.state;return r=s,n.forEach(o),e},Consumer:function(t,n){return e(s,n[0])},injectProps:function(t,e){var r=t.prototype,o=r.connectedCallback,a=r.disconnectedCallback;r.connectedCallback=function(){if(s(this,e),o)return o.call(this)},r.disconnectedCallback=function(){n.delete(this),a&&a.call(this)}}}}({historyType:"browser",location:{pathname:"",query:{},key:""},titleSuffix:"",root:"/",routeViewsUpdated:function(){}},(function(t,e){return Object(r.j)("context-consumer",{subscribe:t,renderer:e})}))},994:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));var r=[{url:"/",component:"testing-ground"},{url:"/tests/kpi",component:"sc-kpi-standard"},{url:"/tests/status-grid",component:"sc-status-grid-standard"},{url:"/tests/sc-webgl-context/nested",component:"sc-webgl-context-nested"},{url:"/tests/sc-webgl-context/root",component:"sc-webgl-context-root"},{url:"/tests/sc-webgl-chart/circle-point-shaders",component:"sc-circle-point-shaders"},{url:"/tests/sc-webgl-chart/angled-line-segment",component:"sc-angled-line-segment"},{url:"/tests/sc-webgl-chart/single-bar",component:"sc-single-bar"},{url:"/tests/sc-webgl-chart/multiple-bars",component:"sc-multiple-bars"},{url:"/tests/sc-webgl-chart/single-colored-bar",component:"sc-single-colored-bar"},{url:"/tests/sc-webgl-chart/straight-line-segment-colored",component:"sc-straight-line-segment-colored"},{url:"/tests/sc-webgl-chart/straight-line-segment",component:"sc-straight-line-segment"},{url:"/tests/sc-webgl-chart/line-chart-dynamic-data-streams",component:"sc-webgl-line-chart-dynamic-data-streams"},{url:"/tests/sc-webgl-chart/line-chart-dynamic-buffer",component:"sc-webgl-line-chart-dynamic-buffer"},{url:"/tests/sc-webgl-chart/line-chart-dynamic-data",component:"sc-webgl-line-chart-dynamic-data"},{url:"/tests/sc-webgl-chart/standard-with-legend",component:"sc-webgl-chart-standard-with-legend"},{url:"/tests/sc-webgl-chart/standard-with-legend-on-right",component:"sc-webgl-chart-standard-with-legend-on-right"},{url:"/tests/sc-webgl-chart/standard",component:"sc-webgl-chart-standard"},{url:"/tests/sc-webgl-chart/unsupported-data-types",component:"line-chart-unsupported-data-types"},{url:"/tests/sc-webgl-chart/sc-webgl-chart-large-viewport",component:"sc-webgl-chart-large-viewport"},{url:"/tests/sc-webgl-chart/multi",component:"sc-webgl-chart-multi"},{url:"/tests/sc-scatter-chart/scatter-chart-dynamic-data",component:"sc-scatter-chart-dynamic-data"},{url:"/tests/sc-scatter-chart/trend-line-with-legend",component:"sc-scatter-chart-trend-line-with-legend"},{url:"/tests/sc-scatter-chart/trend-line-color-configuration",component:"sc-scatter-chart-trend-line-color-configuration"},{url:"/tests/sc-webgl-chart/colored-point",component:"sc-line-chart-colored-point"},{url:"/tests/sc-webgl-chart/multiple-lines",component:"sc-multiple-lines"},{url:"/tests/sc-webgl-chart/multiple-lines-overlapping",component:"sc-multiple-lines-overlapping"},{url:"/tests/sc-expandable-input/standard",component:"sc-expandable-input-standard"},{url:"/tests/sc-sizer-provider/sc-size-provider-standard",component:"sc-size-provider-standard"},{url:"/tests/sc-webgl-bar-chart/standard",component:"sc-webgl-bar-chart-standard"},{url:"/tests/sc-webgl-chart/sc-webgl-chart-dynamic-charts",component:"sc-webgl-chart-dynamic-charts"},{url:"/tests/sc-webgl-bar-chart/bar-chart-dynamic-data-streams",component:"sc-webgl-bar-chart-dynamic-data-streams"},{url:"/tests/sc-webgl-bar-chart/bar-chart-dynamic-data",component:"sc-webgl-bar-chart-dynamic-data"},{url:"/tests/sc-webgl-bar-chart/bar-chart-fast-viewport",component:"sc-webgl-bar-chart-fast-viewport"},{url:"/tests/sc-webgl-bar-chart/bar-chart-dynamic-buffer",component:"sc-webgl-bar-chart-dynamic-buffer"},{url:"/tests/sc-webgl-bar-chart/negative",component:"sc-webgl-bar-chart-negative"},{url:"/tests/sc-webgl-bar-chart/pos-neg",component:"sc-webgl-bar-chart-positive-negative"},{url:"/tests/sc-webgl-bar-chart/threshold/coloration",component:"sc-webgl-bar-chart-threshold-coloration"},{url:"/tests/sc-webgl-bar-chart/threshold/coloration-exact-point",component:"sc-webgl-bar-chart-threshold-coloration-exact-point"},{url:"/tests/sc-webgl-bar-chart/threshold/coloration-multiple-data-stream",component:"sc-webgl-bar-chart-threshold-coloration-multiple-data-stream"},{url:"/tests/sc-webgl-bar-chart/threshold/coloration-multiple-thresholds",component:"sc-webgl-bar-chart-threshold-coloration-multiple-thresholds"},{url:"/tests/sc-webgl-bar-chart/threshold/no-coloration",component:"sc-webgl-bar-chart-threshold-no-coloration"},{url:"/tests/sc-webgl-bar-chart/threshold/coloration-band",component:"sc-webgl-bar-chart-threshold-coloration-band"},{url:"/tests/sc-webgl-chart/performance/sc-line-chart-stream-data",component:"sc-line-chart-stream-data"},{url:"/tests/sc-lazily-load/sc-lazily-load-standard",component:"sc-lazily-load-standard"},{url:"/tests/sc-lazily-load/sc-lazily-load-web-component",component:"sc-lazily-load-web-component"},{url:"/tests/sc-webgl-bar-chart/margin",component:"sc-webgl-bar-chart-margin"},{url:"/tests/sc-webgl-chart/annotations/annotation-editable",component:"sc-webgl-chart-annotation-editable"},{url:"/tests/sc-webgl-chart/annotations/draggable-multi",component:"sc-annotations-draggable-multi"},{url:"/tests/sc-webgl-bar-chart/start-from-zero",component:"sc-webgl-bar-chart-start-from-zero"},{url:"/tests/sc-webgl-bar-chart/unsupported-data-types",component:"sc-webgl-bar-chart-unsupported-data-types"},{url:"/tests/sc-webgl-chart/annotations",component:"sc-webgl-chart-annotations"},{url:"/tests/sc-webgl-chart/threshold/coloration-split-half",component:"sc-webgl-chart-threshold-coloration-split-half"},{url:"/tests/sc-webgl-chart/threshold/coloration-exact-point",component:"sc-webgl-chart-threshold-coloration-exact-point"},{url:"/tests/sc-webgl-chart/threshold/coloration-multiple-data-stream",component:"sc-webgl-chart-threshold-coloration-multiple-data-stream"},{url:"/tests/sc-webgl-chart/threshold/coloration-multiple-thresholds",component:"sc-webgl-chart-threshold-coloration-multiple-thresholds"},{url:"/tests/sc-webgl-chart/threshold/coloration-band",component:"sc-webgl-chart-threshold-coloration-band"},{url:"/tests/sc-webgl-chart/annotations/always-in-viewport",component:"sc-webgl-chart-annotations-always-in-viewport"},{url:"/tests/sc-webgl-chart/tooltip/multiple-data-streams",component:"sc-webgl-chart-tooltip-with-multiple-data-streams"},{url:"/tests/sc-scatter-chart/tooltip/multiple-data-streams-and-trends",component:"sc-scatter-chart-tooltip-with-multiple-data-streams-and-trends"},{url:"/tests/sc-scatter-chart/threshold/coloration",component:"sc-scatter-chart-threshold"},{url:"/tests/sc-scatter-chart/threshold/coloration-exact-point",component:"sc-scatter-chart-threshold-coloration-exact-point"},{url:"/tests/sc-scatter-chart/threshold/coloration-multiple-data-stream",component:"sc-scatter-chart-threshold-coloration-multiple-data-stream"},{url:"/tests/sc-scatter-chart/threshold/coloration-multiple-thresholds",component:"sc-scatter-chart-threshold-coloration-multiple-thresholds"},{url:"/tests/sc-scatter-chart/threshold/coloration-band",component:"sc-scatter-chart-threshold-coloration-band"},{url:"/tests/sc-webgl-chart/axis",component:"sc-webgl-chart-axis"},{url:"/tests/chart/y-range",component:"sc-chart-y-range"},{url:"/tests/sc-webgl-chart/annotations/no-annotations",component:"sc-webgl-chart-no-annotations"},{url:"/tests/sc-scatter-chart/threshold/no-coloration",component:"sc-scatter-chart-threshold-no-coloration"},{url:"/tests/sc-scatter-chart/unsupported-data-types",component:"sc-scatter-chart-unsupported-data-types"},{url:"/tests/common-components/sc-toggle",component:"sc-toggle-test"},{url:"/tests/sc-webgl-chart/single-status",component:"single-status"},{url:"/tests/sc-webgl-chart/single-colored-status",component:"single-colored-status"},{url:"/tests/sc-webgl-chart/multiple-statuses",component:"multiple-statuses"},{url:"/tests/status-timeline/standard",component:"status-timeline-standard"},{url:"/tests/status-timeline/margin",component:"status-timeline-margin"},{url:"/tests/status-timeline/status-timeline-dynamic-data-streams",component:"status-timeline-dynamic-data-streams"},{url:"/tests/status-timeline/status-timeline-dynamic-data",component:"status-timeline-dynamic-data"},{url:"/tests/status-timeline/status-timeline-dynamic-buffer",component:"status-timeline-dynamic-buffer"},{url:"/tests/status-timeline/status-timeline-fast-viewport",component:"status-timeline-fast-viewport"},{url:"/tests/status-timeline/threshold/coloration",component:"status-timeline-threshold-coloration"},{url:"/tests/status-timeline/threshold/coloration-exact-point",component:"status-timeline-threshold-coloration-exact-point"},{url:"/tests/status-timeline/threshold/coloration-multiple-data-stream",component:"status-timeline-threshold-coloration-multiple-data-stream"},{url:"/tests/status-timeline/threshold/coloration-multiple-thresholds",component:"status-timeline-threshold-coloration-multiple-thresholds"},{url:"/tests/status-timeline/threshold/coloration-band",component:"status-timeline-threshold-coloration-band"},{url:"/tests/status-timeline/threshold/no-coloration",component:"status-timeline-threshold-no-coloration"},{url:"/tests/status-timeline/multiple-data-streams",component:"status-timeline-multiple-data-streams"},{url:"/tests/status-timeline/raw-data",component:"status-timeline-raw-data"},{url:"/tests/line-chart/viewport-change",component:"line-chart-viewport-change"},{url:"/tests/widget-test-route",component:"widget-test-route"}]},995:function(t,e,n){"use strict";n.d(e,"a",(function(){return k})),n.d(e,"b",(function(){return S})),n.d(e,"c",(function(){return U})),n.d(e,"d",(function(){return p})),n.d(e,"e",(function(){return d})),n.d(e,"f",(function(){return O})),n.d(e,"g",(function(){return g})),n.d(e,"h",(function(){return u})),n.d(e,"i",(function(){return h})),n.d(e,"j",(function(){return m})),n.d(e,"k",(function(){return A})),n.d(e,"l",(function(){return R})),n.d(e,"m",(function(){return T})),n.d(e,"n",(function(){return L})),n.d(e,"o",(function(){return f})),n.d(e,"p",(function(){return v})),n.d(e,"q",(function(){return E})),n.d(e,"r",(function(){return I}));var r=new RegExp(["(\\\\.)","(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"].join("|"),"g"),o=function(t){return t.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")},s=function(t){return t.replace(/([=!:$/()])/g,"\\$1")},a=function(t){return t&&t.sensitive?"":"i"},i=function(t,e,n){return c(function(t,e){for(var n,a=[],i=0,c=0,l="",u=e&&e.delimiter||"/",h=e&&e.delimiters||"./",p=!1;null!==(n=r.exec(t));){var d=n[0],f=n[1],m=n.index;if(l+=t.slice(c,m),c=m+d.length,f)l+=f[1],p=!0;else{var b="",g=t[c],y=n[2],w=n[3],v=n[4],O=n[5];if(!p&&l.length){var j=l.length-1;h.indexOf(l[j])>-1&&(b=l[j],l=l.slice(0,j))}l&&(a.push(l),l="",p=!1);var x=""!==b&&void 0!==g&&g!==b,P="+"===O||"*"===O,T="?"===O||"*"===O,k=b||u,A=w||v;a.push({name:y||i++,prefix:b,delimiter:k,optional:T,repeat:P,partial:x,pattern:A?s(A):"[^"+o(k)+"]+?"})}}return(l||c<t.length)&&a.push(l+t.substr(c)),a}(t,n),e,n)},c=function(t,e,n){for(var r=(n=n||{}).strict,s=!1!==n.end,i=o(n.delimiter||"/"),c=n.delimiters||"./",l=[].concat(n.endsWith||[]).map(o).concat("$").join("|"),u="",h=!1,p=0;p<t.length;p++){var d=t[p];if("string"==typeof d)u+=o(d),h=p===t.length-1&&c.indexOf(d[d.length-1])>-1;else{var f=o(d.prefix||""),m=d.repeat?"(?:"+d.pattern+")(?:"+f+"(?:"+d.pattern+"))*":d.pattern;e&&e.push(d),d.optional?d.partial?u+=f+"("+m+")?":u+="(?:"+f+"("+m+"))?":u+=f+"("+m+")"}}return s?(r||(u+="(?:"+i+")?"),u+="$"===l?"$":"(?="+l+")"):(r||(u+="(?:"+i+"(?="+l+"))?"),h||(u+="(?="+i+"|"+l+")")),new RegExp("^"+u,a(n))},l=function(t,e,n){return t instanceof RegExp?function(t,e){if(!e)return t;var n=t.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)e.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,pattern:null});return t}(t,e):Array.isArray(t)?function(t,e,n){for(var r=[],o=0;o<t.length;o++)r.push(l(t[o],e,n).source);return new RegExp("(?:"+r.join("|")+")",a(n))}(t,e,n):i(t,e,n)},u=function(t,e){return new RegExp("^"+e+"(\\/|\\?|#|$)","i").test(t)},h=function(t,e){return u(t,e)?t.substr(e.length):t},p=function(t){return"/"===t.charAt(t.length-1)?t.slice(0,-1):t},d=function(t){return"/"===t.charAt(0)?t:"/"+t},f=function(t){return"/"===t.charAt(0)?t.substr(1):t},m=function(t){var e=t.pathname,n=t.search,r=t.hash,o=e||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o},b=function(t){return"/"===t.charAt(0)},g=function(t){return Math.random().toString(36).substr(2,t)},y=function(t,e){for(var n=e,r=n+1,o=t.length;r<o;n+=1,r+=1)t[n]=t[r];t.pop()},w=function t(e,n){if(e===n)return!0;if(null==e||null==n)return!1;if(Array.isArray(e))return Array.isArray(n)&&e.length===n.length&&e.every((function(e,r){return t(e,n[r])}));var r=typeof e;if(r!==typeof n)return!1;if("object"===r){var o=e.valueOf(),s=n.valueOf();if(o!==e||s!==n)return t(o,s);var a=Object.keys(e),i=Object.keys(n);return a.length===i.length&&a.every((function(r){return t(e[r],n[r])}))}return!1},v=function(t,e){return t.pathname===e.pathname&&t.search===e.search&&t.hash===e.hash&&t.key===e.key&&w(t.state,e.state)},O=function(t,e,n,r){var o;"string"==typeof t?(o=function(t){var e=t||"/",n="",r="",o=e.indexOf("#");-1!==o&&(r=e.substr(o),e=e.substr(0,o));var s=e.indexOf("?");return-1!==s&&(n=e.substr(s),e=e.substr(0,s)),{pathname:e,search:"?"===n?"":n,hash:"#"===r?"":r,query:{},key:""}}(t),void 0!==e&&(o.state=e)):((o=Object.assign({pathname:""},t)).search&&"?"!==o.search.charAt(0)&&(o.search="?"+o.search),o.hash&&"#"!==o.hash.charAt(0)&&(o.hash="#"+o.hash),void 0!==e&&void 0===o.state&&(o.state=e));try{o.pathname=decodeURI(o.pathname)}catch(t){throw t instanceof URIError?new URIError('Pathname "'+o.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):t}return o.key=n,r?o.pathname?"/"!==o.pathname.charAt(0)&&(o.pathname=function(t,e){void 0===e&&(e="");var n,r=e&&e.split("/")||[],o=0,s=t&&t.split("/")||[],a=t&&b(t),i=e&&b(e),c=a||i;if(t&&b(t)?r=s:s.length&&(r.pop(),r=r.concat(s)),!r.length)return"/";if(r.length){var l=r[r.length-1];n="."===l||".."===l||""===l}else n=!1;for(var u=r.length;u>=0;u--){var h=r[u];"."===h?y(r,u):".."===h?(y(r,u),o++):o&&(y(r,u),o--)}if(!c)for(;o--;o)r.unshift("..");!c||""===r[0]||r[0]&&b(r[0])||r.unshift("");var p=r.join("/");return n&&"/"!==p.substr(-1)&&(p+="/"),p}(o.pathname,r.pathname)):o.pathname=r.pathname:o.pathname||(o.pathname="/"),o.query=function(t){return t?(/^[?#]/.test(t)?t.slice(1):t).split("&").reduce((function(t,e){var n=e.split("="),r=n[0],o=n[1];return t[r]=o?decodeURIComponent(o.replace(/\+/g," ")):"",t}),{}):{}}(o.search||""),o},j=0,x={},P=function(t,e){var n=""+e.end+e.strict,r=x[n]||(x[n]={}),o=JSON.stringify(t);if(r[o])return r[o];var s=[],a={re:l(t,s,e),keys:s};return j<1e4&&(r[o]=a,j+=1),a},T=function(t,e){void 0===e&&(e={}),"string"==typeof e&&(e={path:e});var n=e.path,r=void 0===n?"/":n,o=e.exact,s=void 0!==o&&o,a=e.strict,i=P(r,{end:s,strict:void 0!==a&&a}),c=i.re,l=i.keys,u=c.exec(t);if(!u)return null;var h=u[0],p=u.slice(1),d=t===h;return s&&!d?null:{path:r,url:"/"===r&&""===h?"/":h,isExact:d,params:l.reduce((function(t,e,n){return t[e.name]=p[n],t}),{})}},k=function(t,e){return null==t&&null==e||null!=e&&t&&e&&t.path===e.path&&t.url===e.url&&w(t.params,e.params)},A=function(t,e,n){return n(t.confirm(e))},E=function(t){return t.metaKey||t.altKey||t.ctrlKey||t.shiftKey},S=function(t){var e=t.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&t.history&&"pushState"in t.history},U=function(t){return-1===t.userAgent.indexOf("Trident")},L=function(t){return-1===t.userAgent.indexOf("Firefox")},R=function(t,e){return void 0===e.state&&-1===t.userAgent.indexOf("CriOS")},I=function(t,e){var n=t[e],r="__storage_test__";try{return n.setItem(r,r),n.removeItem(r),!0}catch(t){return t instanceof DOMException&&(22===t.code||1014===t.code||"QuotaExceededError"===t.name||"NS_ERROR_DOM_QUOTA_REACHED"===t.name)&&0!==n.length}}}}]);