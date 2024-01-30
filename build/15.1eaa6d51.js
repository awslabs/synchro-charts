(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{860:function(e,t,n){"use strict";n.r(t),n.d(t,"sc_angled_line_segment",(function(){return p}));var i=n(13),r=(n(9),n(30)),o=(n(101),n(45),n(48),n(42),n(52),n(102),n(975),n(982)),a=(n(973),n(979),n(980),n(976),n(978)),s=(n(981),n(983)),c=(n(977),new Date(2e3,0,0)),l=new Date(2e3,0,1),h=l.getTime()-c.getTime(),d={x:c.getTime()+h/3,y:0+100/3},u={x:c.getTime()+h*(2/3),y:0+2/3*100},p=function(){function e(e){Object(i.l)(this,e)}return e.prototype.componentDidLoad=function(){var e=this.el.querySelector("#test-container"),t=Object(s.a)({viewport:{start:c,end:l,yMin:0,yMax:100},dataStreams:[{id:"test-stream",name:"test-stream-name",color:"black",data:[d,u],resolution:0,dataType:r.b.NUMBER}],container:e,minBufferSize:100,bufferFactor:2,chartSize:a.a,thresholdOptions:{showColor:!1},thresholds:[]});o.c.addChartScene({manager:t});var n=e.getBoundingClientRect();o.c.setChartRect(t.id,Object.assign({density:1},n.toJSON()))},e.prototype.render=function(){return Object(i.j)("sc-webgl-context",null,Object(i.j)("div",{id:"test-container",style:{width:a.a.width+"px",height:a.a.height+"px"}}))},Object.defineProperty(e.prototype,"el",{get:function(){return Object(i.i)(this)},enumerable:!1,configurable:!0}),e}()},977:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"b",(function(){return r}));var i=1.5,r=function(e){return e.map((function(e){return{id:e.id,name:e.name,detailedName:e.detailedName,color:e.color,unit:e.unit,dataType:e.dataType,streamType:e.streamType,associatedStreams:e.associatedStreams,isLoading:e.isLoading,isRefreshing:e.isRefreshing,error:e.error,resolution:e.resolution}}))}},978:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var i={width:100,height:100}},983:function(e,t,n){"use strict";n.d(t,"a",(function(){return x})),n.d(t,"b",(function(){return g}));var i=n(48),r=n(42),o=n(975),a=n(976),s=n(981),c=n(977),l=function(e){return"\nprecision highp float;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float width;\nuniform float xPixelDensity;\nuniform float yPixelDensity;\nattribute vec2 currPoint;\nattribute vec2 nextPoint;\nattribute vec2 position;\nattribute vec3 segmentColor;\nvarying vec3 vColor;\n"+(e?"varying float yPositionPx;":"")+"\n\n// line shader using instanced lines\n// https://wwwtyro.net/2019/11/18/instanced-lines.html for information on this approach\nvoid main() {\n  // Convert the points to pixel coordinates - otherwise out basis vectors won't be perpendicular when\n  // rasterized to the screen.\n  vec2 currPointPx = vec2(currPoint.x / xPixelDensity, currPoint.y / yPixelDensity);\n  vec2 nextPointPx = vec2(nextPoint.x / xPixelDensity, nextPoint.y / yPixelDensity);\n\n  // create the basis vectors of a coordinate space where the x axis is parallel with\n  // the path between currPoint and nextPoint, and the y axis is perpendicular to the\n  // path between currPoint and nextPoint\n  vec2 xBasis = nextPointPx - currPointPx;\n  vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));\n\n  // project the instance segment along the basis vectors\n  vec2 positionPx = currPointPx + xBasis * position.x + yBasis * width * position.y;\n\n  // Convert from pixel coordinates back to model space\n  vec2 positionModel = vec2(positionPx.x * xPixelDensity, positionPx.y * yPixelDensity);\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(positionModel, 0.0, 1.0);\n  vColor = segmentColor;\n  "+(e?"yPositionPx = positionPx.y;":"")+"\n}\n"},h="\n// This file is only being used when we have threshold bands\n// that will break the line segments into different color\n#define MAX_NUM_TOTAL_THRESHOLD_BAND "+s.a+"\n\nprecision highp float;\nstruct Band {\n  float upper;\n  float lower;\n  vec3 color;\n};\n\nvarying vec3 vColor;\nvarying float yPositionPx;\nuniform float yPixelDensity;\nuniform Band thresholdBands[MAX_NUM_TOTAL_THRESHOLD_BAND];\n\n// Fills in triangles which make up a line segment, with the corresponding color\nvoid main() {\n  for(int i = 0; i < MAX_NUM_TOTAL_THRESHOLD_BAND; i++) {\n    bool isRangeBreached = yPositionPx > thresholdBands[i].lower / yPixelDensity\n      && yPositionPx < thresholdBands[i].upper / yPixelDensity;\n    bool isEqualsThreshold = thresholdBands[i].lower == thresholdBands[i].upper;\n    bool isEqualsThresholdBreached = yPositionPx == thresholdBands[i].upper;\n\n    if (isRangeBreached || (isEqualsThreshold && isEqualsThresholdBreached)) {\n       gl_FragColor = vec4(thresholdBands[i].color / 255.0, 1.0);\n       break;\n    } else {\n       gl_FragColor = vec4(vColor, 1.0);\n    }\n  }\n}\n",d=function(e){var t=e.viewport,n=t.end,i=t.start,r=t.yMax,o=t.yMin,a=e.toClipSpace,s=e.size,c=s.width,l=s.height;return{x:Math.abs((a(n.getTime())-a(i.getTime()))/c),y:Math.abs((r-o)/l)}},u=c.a,p=function(e,t,n){var i=e.filter(r.c).map((function(e){return Object(a.f)(e,e.resolution)}));t.count=function(e){return e.reduce((function(e,t){return e+Math.max(t.length,0)}),0)}(i);var o=t.geometry.attributes,s=o.currPoint,c=o.nextPoint,l=o.segmentColor,h=0,d=0;i.forEach((function(e){e.forEach((function(t,i){var r=i===e.length-1?t:e[i+1],o=t[0],a=t[1],u=t[2],p=t[3],f=t[4],y=r[0],m=r[1];s.array[h]=n(o),s.array[h+1]=a,c.array[h]=n(y),c.array[h+1]=m,l.array[d]=u,l.array[d+1]=p,l.array[d+2]=f,d+=3,h+=2}))})),s.needsUpdate=!0,c.needsUpdate=!0,l.needsUpdate=!0},f=[[0,-.5],[1,-.5],[1,.5],[0,-.5],[1,.5],[0,.5]],y=function(e,t){e.setAttribute("position",new o.a(new Float32Array(f.flat()),2)),e.setAttribute("currPoint",new o.j(new Float32Array(2*t),2,!1)),e.setAttribute("nextPoint",new o.j(new Float32Array(2*t),2,!1)),e.setAttribute("segmentColor",new o.j(new Uint8Array(3*t),3,!0))},m=function(e){var t=e.viewport,n=e.dataStreams,i=e.chartSize,r=e.minBufferSize,c=e.bufferFactor,f=e.toClipSpace,m=e.thresholdOptions,v=e.thresholds,x=new o.c,g=Math.max(r,Object(a.e)(n)*c);y(x,g);var w=d({viewport:t,toClipSpace:f,size:i}),b=w.x,P=w.y,S=m.showColor,C=void 0===S||S,B=new o.f({vertexShader:l(C&&v.length>0),fragmentShader:C&&0!==v.length?h:"\nprecision highp float;\nvarying vec3 vColor;\n\n// Fills in triangles which make up a line segment, with the corresponding color\nvoid main() {\n  gl_FragColor = vec4(vColor, 1.0);\n}\n",side:o.b,transparent:!0,uniforms:{width:{value:u},xPixelDensity:{value:b},yPixelDensity:{value:P},thresholdBands:{value:Object(s.e)(v)}}}),O=new o.i(x,B,g);return O.frustumCulled=!1,p(n,O,f),O},v=function(e){var t=e.chartSize,n=e.toClipSpace,i=e.lines,r=e.dataStreams,o=e.viewport,a=e.hasDataChanged,s=d({viewport:o,toClipSpace:n,size:t}),c=s.x,l=s.y;i.material.uniforms.xPixelDensity.value=c,i.material.uniforms.yPixelDensity.value=l,a&&p(r,i,n)},x=function(e){var t=e.dataStreams,n=e.chartSize,r=e.container,c=e.viewport,l=e.minBufferSize,h=e.bufferFactor,d=e.onUpdate,u=e.thresholdOptions,p=e.thresholds,f=new o.g,y=Object(a.a)(c),v=Object(i.c)(p),x=[];return x[1]=m({toClipSpace:y,chartSize:n,dataStreams:t,viewport:c,minBufferSize:l,bufferFactor:h,thresholdOptions:u,thresholds:v}),x[s.c]=Object(s.d)({dataStreams:t,minBufferSize:l,bufferFactor:h,toClipSpace:y,thresholdOptions:u,thresholds:v}),x.forEach((function(e){return f.add(e)})),Object(a.c)({scene:f,viewport:c,container:r,toClipSpace:y,onUpdate:d})},g=function(e){var t=e.scene,n=e.dataStreams,i=e.chartSize,r=e.container,o=e.viewport,c=e.hasDataChanged,l=e.bufferFactor,h=e.minBufferSize,d=e.onUpdate,u=e.thresholdOptions,p=e.hasAnnotationChanged,f=e.thresholds,y=t.scene.children[1],m=t.scene.children[s.c];return function(e){return e.geometry.attributes.position.array.length/s.b}(m)<Object(a.e)(n)||Object(a.b)(o,t.toClipSpace)||p?x({dataStreams:n,chartSize:i,container:r,viewport:o,minBufferSize:h,bufferFactor:l,onUpdate:d,thresholdOptions:u,thresholds:f}):(v({lines:y,dataStreams:n,chartSize:i,viewport:o,hasDataChanged:c,toClipSpace:t.toClipSpace}),Object(s.f)(n,m,t.toClipSpace,c),t)}}}]);