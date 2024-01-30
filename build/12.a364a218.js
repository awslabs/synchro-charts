(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{875:function(e,t,n){"use strict";n.r(t),n.d(t,"sc_line_chart",(function(){return d}));var i=n(13),r=n(9),o=n(30),a=(n(101),n(45),n(48),n(42),n(52),n(102),n(975),n(973),n(979),n(980),n(976),n(981),n(983)),s=(n(977),n(985)),c=n(988),l=function(e){return Object(i.j)("sc-tooltip",Object.assign({},e,{visualizesAlarms:!1,supportString:!1,dataAlignment:r.b.EITHER}))},d=function(){function e(e){Object(i.l)(this,e),this.gestures=!0,this.isEditing=!1,this.bufferFactor=2,this.minBufferSize=1e3}return e.prototype.componentWillRender=function(){Object(s.a)(this)},e.prototype.render=function(){var e=this;return Object(i.j)("sc-size-provider",{size:this.size,renderFunc:function(t){return Object(i.j)("sc-webgl-base-chart",{supportedDataTypes:[o.b.NUMBER],axis:e.axis,alarms:e.alarms,gestures:e.gestures,configId:e.widgetId,legend:e.legend,annotations:e.annotations,trends:e.trends,updateChartScene:a.b,createChartScene:a.a,size:Object.assign(Object.assign(Object.assign({},c.a.size),e.size),t),dataStreams:e.dataStreams,viewport:e.viewport,minBufferSize:e.minBufferSize,bufferFactor:e.bufferFactor,isEditing:e.isEditing,renderTooltip:l,supportString:!1,visualizesAlarms:!1,messageOverrides:e.messageOverrides})}})},e}()},977:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"b",(function(){return r}));var i=1.5,r=function(e){return e.map((function(e){return{id:e.id,name:e.name,detailedName:e.detailedName,color:e.color,unit:e.unit,dataType:e.dataType,streamType:e.streamType,associatedStreams:e.associatedStreams,isLoading:e.isLoading,isRefreshing:e.isRefreshing,error:e.error,resolution:e.resolution}}))}},983:function(e,t,n){"use strict";n.d(t,"a",(function(){return y})),n.d(t,"b",(function(){return g}));var i=n(48),r=n(42),o=n(975),a=n(976),s=n(981),c=n(977),l=function(e){return"\nprecision highp float;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float width;\nuniform float xPixelDensity;\nuniform float yPixelDensity;\nattribute vec2 currPoint;\nattribute vec2 nextPoint;\nattribute vec2 position;\nattribute vec3 segmentColor;\nvarying vec3 vColor;\n"+(e?"varying float yPositionPx;":"")+"\n\n// line shader using instanced lines\n// https://wwwtyro.net/2019/11/18/instanced-lines.html for information on this approach\nvoid main() {\n  // Convert the points to pixel coordinates - otherwise out basis vectors won't be perpendicular when\n  // rasterized to the screen.\n  vec2 currPointPx = vec2(currPoint.x / xPixelDensity, currPoint.y / yPixelDensity);\n  vec2 nextPointPx = vec2(nextPoint.x / xPixelDensity, nextPoint.y / yPixelDensity);\n\n  // create the basis vectors of a coordinate space where the x axis is parallel with\n  // the path between currPoint and nextPoint, and the y axis is perpendicular to the\n  // path between currPoint and nextPoint\n  vec2 xBasis = nextPointPx - currPointPx;\n  vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));\n\n  // project the instance segment along the basis vectors\n  vec2 positionPx = currPointPx + xBasis * position.x + yBasis * width * position.y;\n\n  // Convert from pixel coordinates back to model space\n  vec2 positionModel = vec2(positionPx.x * xPixelDensity, positionPx.y * yPixelDensity);\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(positionModel, 0.0, 1.0);\n  vColor = segmentColor;\n  "+(e?"yPositionPx = positionPx.y;":"")+"\n}\n"},d="\n// This file is only being used when we have threshold bands\n// that will break the line segments into different color\n#define MAX_NUM_TOTAL_THRESHOLD_BAND "+s.a+"\n\nprecision highp float;\nstruct Band {\n  float upper;\n  float lower;\n  vec3 color;\n};\n\nvarying vec3 vColor;\nvarying float yPositionPx;\nuniform float yPixelDensity;\nuniform Band thresholdBands[MAX_NUM_TOTAL_THRESHOLD_BAND];\n\n// Fills in triangles which make up a line segment, with the corresponding color\nvoid main() {\n  for(int i = 0; i < MAX_NUM_TOTAL_THRESHOLD_BAND; i++) {\n    bool isRangeBreached = yPositionPx > thresholdBands[i].lower / yPixelDensity\n      && yPositionPx < thresholdBands[i].upper / yPixelDensity;\n    bool isEqualsThreshold = thresholdBands[i].lower == thresholdBands[i].upper;\n    bool isEqualsThresholdBreached = yPositionPx == thresholdBands[i].upper;\n\n    if (isRangeBreached || (isEqualsThreshold && isEqualsThresholdBreached)) {\n       gl_FragColor = vec4(thresholdBands[i].color / 255.0, 1.0);\n       break;\n    } else {\n       gl_FragColor = vec4(vColor, 1.0);\n    }\n  }\n}\n",u=function(e){var t=e.viewport,n=t.end,i=t.start,r=t.yMax,o=t.yMin,a=e.toClipSpace,s=e.size,c=s.width,l=s.height;return{x:Math.abs((a(n.getTime())-a(i.getTime()))/c),y:Math.abs((r-o)/l)}},h=c.a,f=function(e,t,n){var i=e.filter(r.c).map((function(e){return Object(a.f)(e,e.resolution)}));t.count=function(e){return e.reduce((function(e,t){return e+Math.max(t.length,0)}),0)}(i);var o=t.geometry.attributes,s=o.currPoint,c=o.nextPoint,l=o.segmentColor,d=0,u=0;i.forEach((function(e){e.forEach((function(t,i){var r=i===e.length-1?t:e[i+1],o=t[0],a=t[1],h=t[2],f=t[3],p=t[4],b=r[0],m=r[1];s.array[d]=n(o),s.array[d+1]=a,c.array[d]=n(b),c.array[d+1]=m,l.array[u]=h,l.array[u+1]=f,l.array[u+2]=p,u+=3,d+=2}))})),s.needsUpdate=!0,c.needsUpdate=!0,l.needsUpdate=!0},p=[[0,-.5],[1,-.5],[1,.5],[0,-.5],[1,.5],[0,.5]],b=function(e,t){e.setAttribute("position",new o.a(new Float32Array(p.flat()),2)),e.setAttribute("currPoint",new o.j(new Float32Array(2*t),2,!1)),e.setAttribute("nextPoint",new o.j(new Float32Array(2*t),2,!1)),e.setAttribute("segmentColor",new o.j(new Uint8Array(3*t),3,!0))},m=function(e){var t=e.viewport,n=e.dataStreams,i=e.chartSize,r=e.minBufferSize,c=e.bufferFactor,p=e.toClipSpace,m=e.thresholdOptions,v=e.thresholds,y=new o.c,g=Math.max(r,Object(a.e)(n)*c);b(y,g);var x=u({viewport:t,toClipSpace:p,size:i}),w=x.x,S=x.y,P=m.showColor,O=void 0===P||P,C=new o.f({vertexShader:l(O&&v.length>0),fragmentShader:O&&0!==v.length?d:"\nprecision highp float;\nvarying vec3 vColor;\n\n// Fills in triangles which make up a line segment, with the corresponding color\nvoid main() {\n  gl_FragColor = vec4(vColor, 1.0);\n}\n",side:o.b,transparent:!0,uniforms:{width:{value:h},xPixelDensity:{value:w},yPixelDensity:{value:S},thresholdBands:{value:Object(s.e)(v)}}}),j=new o.i(y,C,g);return j.frustumCulled=!1,f(n,j,p),j},v=function(e){var t=e.chartSize,n=e.toClipSpace,i=e.lines,r=e.dataStreams,o=e.viewport,a=e.hasDataChanged,s=u({viewport:o,toClipSpace:n,size:t}),c=s.x,l=s.y;i.material.uniforms.xPixelDensity.value=c,i.material.uniforms.yPixelDensity.value=l,a&&f(r,i,n)},y=function(e){var t=e.dataStreams,n=e.chartSize,r=e.container,c=e.viewport,l=e.minBufferSize,d=e.bufferFactor,u=e.onUpdate,h=e.thresholdOptions,f=e.thresholds,p=new o.g,b=Object(a.a)(c),v=Object(i.c)(f),y=[];return y[1]=m({toClipSpace:b,chartSize:n,dataStreams:t,viewport:c,minBufferSize:l,bufferFactor:d,thresholdOptions:h,thresholds:v}),y[s.c]=Object(s.d)({dataStreams:t,minBufferSize:l,bufferFactor:d,toClipSpace:b,thresholdOptions:h,thresholds:v}),y.forEach((function(e){return p.add(e)})),Object(a.c)({scene:p,viewport:c,container:r,toClipSpace:b,onUpdate:u})},g=function(e){var t=e.scene,n=e.dataStreams,i=e.chartSize,r=e.container,o=e.viewport,c=e.hasDataChanged,l=e.bufferFactor,d=e.minBufferSize,u=e.onUpdate,h=e.thresholdOptions,f=e.hasAnnotationChanged,p=e.thresholds,b=t.scene.children[1],m=t.scene.children[s.c];return function(e){return e.geometry.attributes.position.array.length/s.b}(m)<Object(a.e)(n)||Object(a.b)(o,t.toClipSpace)||f?y({dataStreams:n,chartSize:i,container:r,viewport:o,minBufferSize:d,bufferFactor:l,onUpdate:u,thresholdOptions:h,thresholds:p}):(v({lines:b,dataStreams:n,chartSize:i,viewport:o,hasDataChanged:c,toClipSpace:t.toClipSpace}),Object(s.f)(n,m,t.toClipSpace,c),t)}},985:function(e,t,n){"use strict";n.d(t,"a",(function(){return d}));var i=n(101),r=n(42),o=n(973),a=Object(o.b)((function(e,t){function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if(!("string"==typeof e||e instanceof String)){var t=n(e);throw null===e?t="null":"object"===t&&(t=e.constructor.name),new TypeError("Expected a string but received a ".concat(t))}},e.exports=t.default,e.exports.default=t.default}));Object(o.c)(a);var s=Object(o.b)((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};(0,n.default)(e);var a=t.strictSeparator?r.test(e):i.test(e);return a&&t.strict?o(e):a};var n=function(e){return e&&e.__esModule?e:{default:e}}(a),i=/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,r=/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,o=function(e){var t=e.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);if(t){var n=Number(t[1]),i=Number(t[2]);return n%4==0&&n%100!=0||n%400==0?i<=366:i<=365}var r=e.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number),o=r[1],a=r[2],s=r[3],c=a?"0".concat(a).slice(-2):a,l=s?"0".concat(s).slice(-2):s,d=new Date("".concat(o,"-").concat(c||"01","-").concat(l||"01"));return!a||!s||d.getUTCFullYear()===o&&d.getUTCMonth()+1===a&&d.getUTCDate()===s};e.exports=t.default,e.exports.default=t.default})),c=Object(o.c)(s),l=function(e){return e instanceof Date||c(e)},d=function(e){var t=e.viewport;if(null!=t){if(Object(r.b)(t)&&null!=t.duration&&console.warn("Detected both static and live viewport type. Duration will be used"),Object(r.b)(t)&&(!l(t.start)||!l(t.end)))throw new Error("Unable to parse start date: '"+t.start+"' and/or end date: '"+t.end+"'");if(!Object(r.b)(t)&&"string"==typeof t.duration&&null==Object(i.a)(t.duration,"ms"))throw new Error("Unable to parse duration: '"+t.duration+"'")}}},988:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return a}));var i=n(9),r={widgetId:"fake-id",viewport:{start:new Date(1995,0,0,0),end:new Date(2020,1,0,0),yMin:0,yMax:1e4},size:{width:475,height:350,marginLeft:50,marginRight:50,marginTop:24,marginBottom:30},movement:{enableXScroll:!0,enableYScroll:!1,zoomMax:1/0,zoomMin:1e-5},layout:{xGridVisible:!1,yGridVisible:!0,xTicksVisible:!0,yTicksVisible:!0},scale:{xScaleType:i.d.TimeSeries,yScaleType:i.d.Linear,xScaleSide:"bottom",yScaleSide:"left"},dataStreams:[],legend:{position:i.c.BOTTOM,width:170}},o={showColor:!0},a={showColor:!1}}}]);