(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{890:function(e,t,r){"use strict";r.r(t),r.d(t,"sc_scatter_chart",(function(){return h}));var n=r(13),i=r(9),o=r(30),a=(r(101),r(45),r(48)),s=(r(42),r(52),r(102),r(975)),c=(r(973),r(979),r(980),r(976)),d=r(981),u=r(985),l=r(988),f=function(e){var t=e.dataStreams,r=e.container,n=e.viewport,i=e.minBufferSize,o=e.bufferFactor,u=e.onUpdate,l=e.thresholdOptions,f=e.thresholds,b=new s.g,p=Object(c.a)(n),h=Object(a.c)(f),m=[];return m[d.c]=Object(d.d)({dataStreams:t,minBufferSize:i,bufferFactor:o,toClipSpace:p,thresholdOptions:l,thresholds:h}),m.forEach((function(e){return b.add(e)})),Object(c.c)({scene:b,viewport:n,container:r,toClipSpace:p,onUpdate:u})},b=function(e){var t=e.scene,r=e.dataStreams,n=e.chartSize,i=e.container,o=e.viewport,a=e.hasDataChanged,s=e.bufferFactor,u=e.minBufferSize,l=e.onUpdate,b=e.thresholdOptions,p=e.thresholds,h=e.hasAnnotationChanged,m=t.scene.children[d.c];return function(e){return e.geometry.attributes.position.array.length/d.b}(m)<Object(c.e)(r)||Object(c.b)(o,t.toClipSpace)||h?f({dataStreams:r,chartSize:n,container:i,viewport:o,minBufferSize:u,bufferFactor:s,onUpdate:l,thresholdOptions:b,thresholds:p}):(a&&Object(d.f)(r,m,t.toClipSpace),t)},p=function(e){return Object(n.j)("sc-tooltip",Object.assign({},e,{visualizesAlarms:!1,supportString:!1,dataAlignment:i.b.EITHER}))},h=function(){function e(e){Object(n.l)(this,e),this.gestures=!0,this.isEditing=!1,this.bufferFactor=2,this.minBufferSize=1e3}return e.prototype.componentWillRender=function(){Object(u.a)(this)},e.prototype.render=function(){var e=this;return Object(n.j)("sc-size-provider",{size:this.size,renderFunc:function(t){return Object(n.j)("sc-webgl-base-chart",{supportedDataTypes:[o.b.NUMBER],axis:e.axis,gestures:e.gestures,configId:e.widgetId,legend:e.legend,annotations:e.annotations,trends:e.trends,updateChartScene:b,createChartScene:f,size:Object.assign(Object.assign(Object.assign({},l.a.size),e.size),t),dataStreams:e.dataStreams,alarms:e.alarms,viewport:e.viewport,minBufferSize:e.minBufferSize,bufferFactor:e.bufferFactor,isEditing:e.isEditing,renderTooltip:p,supportString:!1,visualizesAlarms:!1,messageOverrides:e.messageOverrides})}})},e}()},985:function(e,t,r){"use strict";r.d(t,"a",(function(){return u}));var n=r(101),i=r(42),o=r(973),a=Object(o.b)((function(e,t){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if(!("string"==typeof e||e instanceof String)){var t=r(e);throw null===e?t="null":"object"===t&&(t=e.constructor.name),new TypeError("Expected a string but received a ".concat(t))}},e.exports=t.default,e.exports.default=t.default}));Object(o.c)(a);var s=Object(o.b)((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};(0,r.default)(e);var a=t.strictSeparator?i.test(e):n.test(e);return a&&t.strict?o(e):a};var r=function(e){return e&&e.__esModule?e:{default:e}}(a),n=/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,i=/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,o=function(e){var t=e.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);if(t){var r=Number(t[1]),n=Number(t[2]);return r%4==0&&r%100!=0||r%400==0?n<=366:n<=365}var i=e.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number),o=i[1],a=i[2],s=i[3],c=a?"0".concat(a).slice(-2):a,d=s?"0".concat(s).slice(-2):s,u=new Date("".concat(o,"-").concat(c||"01","-").concat(d||"01"));return!a||!s||u.getUTCFullYear()===o&&u.getUTCMonth()+1===a&&u.getUTCDate()===s};e.exports=t.default,e.exports.default=t.default})),c=Object(o.c)(s),d=function(e){return e instanceof Date||c(e)},u=function(e){var t=e.viewport;if(null!=t){if(Object(i.b)(t)&&null!=t.duration&&console.warn("Detected both static and live viewport type. Duration will be used"),Object(i.b)(t)&&(!d(t.start)||!d(t.end)))throw new Error("Unable to parse start date: '"+t.start+"' and/or end date: '"+t.end+"'");if(!Object(i.b)(t)&&"string"==typeof t.duration&&null==Object(n.a)(t.duration,"ms"))throw new Error("Unable to parse duration: '"+t.duration+"'")}}},988:function(e,t,r){"use strict";r.d(t,"a",(function(){return i})),r.d(t,"b",(function(){return o})),r.d(t,"c",(function(){return a}));var n=r(9),i={widgetId:"fake-id",viewport:{start:new Date(1995,0,0,0),end:new Date(2020,1,0,0),yMin:0,yMax:1e4},size:{width:475,height:350,marginLeft:50,marginRight:50,marginTop:24,marginBottom:30},movement:{enableXScroll:!0,enableYScroll:!1,zoomMax:1/0,zoomMin:1e-5},layout:{xGridVisible:!1,yGridVisible:!0,xTicksVisible:!0,yTicksVisible:!0},scale:{xScaleType:n.d.TimeSeries,yScaleType:n.d.Linear,xScaleSide:"bottom",yScaleSide:"left"},dataStreams:[],legend:{position:n.c.BOTTOM,width:170}},o={showColor:!0},a={showColor:!1}}}]);