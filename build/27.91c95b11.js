(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{1031:function(e,t,r){"use strict";r.d(t,"a",(function(){return u}));var n=r(138),i=r(54),o=r(1019),a=Object(o.b)((function(e,t){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if(!("string"==typeof e||e instanceof String)){var t=r(e);throw null===e?t="null":"object"===t&&(t=e.constructor.name),new TypeError("Expected a string but received a ".concat(t))}},e.exports=t.default,e.exports.default=t.default}));Object(o.c)(a);var s=Object(o.b)((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};(0,r.default)(e);var a=t.strictSeparator?i.test(e):n.test(e);return a&&t.strict?o(e):a};var r=function(e){return e&&e.__esModule?e:{default:e}}(a),n=/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,i=/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,o=function(e){var t=e.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);if(t){var r=Number(t[1]),n=Number(t[2]);return r%4==0&&r%100!=0||r%400==0?n<=366:n<=365}var i=e.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number),o=i[1],a=i[2],s=i[3],c=a?"0".concat(a).slice(-2):a,d=s?"0".concat(s).slice(-2):s,u=new Date("".concat(o,"-").concat(c||"01","-").concat(d||"01"));return!a||!s||u.getUTCFullYear()===o&&u.getUTCMonth()+1===a&&u.getUTCDate()===s};e.exports=t.default,e.exports.default=t.default})),c=Object(o.c)(s),d=function(e){return e instanceof Date||c(e)},u=function(e){var t=e.viewport;if(null!=t){if(Object(i.b)(t)&&null!=t.duration&&console.warn("Detected both static and live viewport type. Duration will be used"),Object(i.b)(t)&&(!d(t.start)||!d(t.end)))throw new Error("Unable to parse start date: '"+t.start+"' and/or end date: '"+t.end+"'");if(!Object(i.b)(t)&&"string"==typeof t.duration&&null==Object(n.a)(t.duration,"ms"))throw new Error("Unable to parse duration: '"+t.duration+"'")}}},1034:function(e,t,r){"use strict";r.d(t,"a",(function(){return i})),r.d(t,"b",(function(){return o})),r.d(t,"c",(function(){return a}));var n=r(8),i={widgetId:"fake-id",viewport:{start:new Date(1995,0,0,0),end:new Date(2020,1,0,0),yMin:0,yMax:1e4},size:{width:475,height:350,marginLeft:50,marginRight:50,marginTop:24,marginBottom:30},movement:{enableXScroll:!0,enableYScroll:!1,zoomMax:1/0,zoomMin:1e-5},layout:{xGridVisible:!1,yGridVisible:!0,xTicksVisible:!0,yTicksVisible:!0},scale:{xScaleType:n.d.TimeSeries,yScaleType:n.d.Linear,xScaleSide:"bottom",yScaleSide:"left"},dataStreams:[],legend:{position:n.c.BOTTOM,width:170}},o={showColor:!0},a={showColor:!1}},911:function(e,t,r){"use strict";r.r(t),r.d(t,"sc_bar_chart",(function(){return u}));var n=r(13),i=r(8),o=r(38),a=(r(138),r(64),r(69),r(54),r(75),r(139),r(1021),r(1019),r(1025),r(1026),r(1022),r(1030),r(1037)),s=r(1031),c=r(1034),d=function(e){return Object(n.j)("sc-tooltip",Object.assign({},e,{visualizesAlarms:!1,supportString:!1,dataAlignment:i.b.EITHER}))},u=function(){function e(e){Object(n.l)(this,e),this.gestures=!0,this.isEditing=!1,this.bufferFactor=2,this.minBufferSize=1e3}return e.prototype.componentWillRender=function(){Object(s.a)(this)},e.prototype.render=function(){var e=this;return Object(n.j)("sc-size-provider",{size:this.size,renderFunc:function(t){return Object(n.j)("sc-webgl-base-chart",{supportedDataTypes:[o.b.NUMBER],axis:e.axis,gestures:e.gestures,configId:e.widgetId,legend:e.legend,annotations:e.annotations,trends:e.trends,updateChartScene:a.b,createChartScene:a.a,size:Object.assign(Object.assign(Object.assign({},c.a.size),e.size),t),dataStreams:e.dataStreams,alarms:e.alarms,viewport:e.viewport,minBufferSize:e.minBufferSize,bufferFactor:e.bufferFactor,isEditing:e.isEditing,yRangeStartFromZero:!0,renderTooltip:d,supportString:!1,visualizesAlarms:!1,messageOverrides:e.messageOverrides})}})},e}()}}]);