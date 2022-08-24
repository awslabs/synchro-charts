(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{1037:function(t,e,r){"use strict";r.d(e,"a",(function(){return a}));var a=function(t,e){return Math.abs(t(new Date(e).getTime())-t(new Date(0).getTime()))}},1046:function(t,e,r){"use strict";r.d(e,"a",(function(){return m})),r.d(e,"b",(function(){return b}));var a=r(70),n=r(55),o=r(1029),i=r(1031),s=r(1037),c=function(t){var e=t.toClipSpace,r=t.resolution,a=t.numDataStreams;return(Object(s.a)(e,r)-function(t,e){return Object(s.a)(t,.16666666666666666*e)}(e,r))/a},u=function(t,e){if(0===t.length)return 0;var r=t[0].resolution;return c({toClipSpace:e,numDataStreams:t.length,resolution:r})},h=function(t){var e=t.dataStreams,r=t.mesh,o=t.toClipSpace,s=t.thresholds,c=t.thresholdOptions,h=e.filter(n.c).map((function(t){return Object(i.f)(t,t.resolution)}));r.count=function(t){return t.reduce((function(t,e){return t+e.length}),0)}(h);var d=r.geometry.attributes,l=d.color,p=d.bar,f=0,m=0;h.forEach((function(t,r){t.forEach((function(t){var n=t[0],h=t[1],d=t[2],b=t[3],g=t[4];p.array[f]=o(n)-r*u(e,o),p.array[f+1]=h;var v=Object(a.a)(h,s);if(null!=v&&c.showColor){var w=Object(i.d)(v.color),S=w[0],y=w[1],O=w[2];l.array[m]=S,l.array[m+1]=y,l.array[m+2]=O}else l.array[m]=d,l.array[m+1]=b,l.array[m+2]=g;m+=3,f+=2}))})),p.needsUpdate=!0,l.needsUpdate=!0},d=[0,0,0,1,1,0,0,1,1,0,1,1],l=function(t,e){t.setAttribute("position",new o.a(new Float32Array(d),2)),t.setAttribute("bar",new o.j(new Float32Array(2*e),2,!1)),t.setAttribute("color",new o.j(new Uint8Array(3*e),3,!0))},p=function(t){var e=t.dataStreams,r=t.toClipSpace,a=t.bufferFactor,n=t.minBufferSize,s=t.thresholdOptions,c=t.thresholds,d=new o.c,p=Math.max(n,Object(i.e)(e)*a);l(d,p);var f=new o.f({vertexShader:"\nprecision highp float;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float width;\nattribute vec2 bar;\nattribute vec2 position;\nattribute vec3 color;\nvarying vec3 vColor;\n\nvoid main() {\n  // Negative width here because we want to render the bars' width to the left side starting from its x position.\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * -width + bar.x, position.y * bar.y, 0.0, 1.0);\n  vColor = color;\n}\n",fragmentShader:"\nprecision highp float;\nvarying vec3 vColor;\n\nvoid main() {\n  gl_FragColor = vec4(vColor, 1.0);\n}\n",side:o.b,transparent:!1,uniforms:{width:{value:u(e,r)}}}),m=new o.i(d,f,p);return h({dataStreams:e,mesh:m,toClipSpace:r,thresholds:c,thresholdOptions:s}),m.frustumCulled=!1,m},f=function(t){var e=t.bars,r=t.dataStreams,a=t.toClipSpace,n=t.hasDataChanged,o=t.thresholdOptions,i=t.thresholds;n&&(e.material.uniforms.width.value=u(r,a),h({dataStreams:r,mesh:e,toClipSpace:a,thresholds:i,thresholdOptions:o}))},m=function(t){var e=t.dataStreams,r=t.container,a=t.viewport,n=t.bufferFactor,s=t.minBufferSize,c=t.onUpdate,u=t.thresholdOptions,h=t.thresholds,d=new o.g,l=Object(i.a)(a);return d.add(p({dataStreams:e,toClipSpace:l,bufferFactor:n,minBufferSize:s,thresholdOptions:u,thresholds:h})),Object(i.c)({scene:d,viewport:a,container:r,toClipSpace:l,onUpdate:c})},b=function(t){var e=t.scene,r=t.dataStreams,a=t.hasDataChanged,n=t.minBufferSize,o=t.bufferFactor,s=t.viewport,c=t.container,u=t.onUpdate,h=t.chartSize,d=t.thresholdOptions,l=t.thresholds,p=t.hasAnnotationChanged,b=e.scene.children[0];return function(t){return t.geometry.attributes.bar.array.length/2}(b)<Object(i.e)(r)||Object(i.b)(s,e.toClipSpace)||p?m({onUpdate:u,dataStreams:r,container:c,viewport:s,minBufferSize:n,bufferFactor:o,chartSize:h,thresholdOptions:d,thresholds:l}):(f({bars:b,dataStreams:r,toClipSpace:e.toClipSpace,hasDataChanged:a,thresholdOptions:d,thresholds:l}),e)}},939:function(t,e,r){"use strict";r.r(e),r.d(e,"sc_multiple_bars",(function(){return f}));var a=r(13),n=(r(14),r(39)),o=(r(142),r(65)),i=(r(70),r(55),r(77),r(143),r(1029),r(1038)),s=(r(1030),r(1033),r(1034),r(1031),r(1037),r(1040)),c=r(1046),u=new Date(2e3,0,0),h=new Date(2e3,0,1),d=h.getTime()-u.getTime(),l={x:u.getTime()+d/3,y:25},p={x:u.getTime()+d*(2/3),y:50},f=function(){function t(t){Object(a.l)(this,t)}return t.prototype.componentDidLoad=function(){var t,e,r=this.el.querySelector("#test-container"),a=Object(c.a)({viewport:{start:u,end:h,yMin:0,yMax:100},dataStreams:[{id:"test-stream",name:"test-stream-name",color:"black",aggregates:(t={},t[5*o.b]=[l],t),data:[],resolution:5*o.b,dataType:n.b.NUMBER},{id:"test-stream-2",name:"test-stream-name-2",color:"red",aggregates:(e={},e[5*o.b]=[p],e),data:[],resolution:5*o.b,dataType:n.b.NUMBER}],container:r,chartSize:s.a,minBufferSize:100,bufferFactor:2,thresholdOptions:{showColor:!1},thresholds:[]});i.b.addChartScene({manager:a});var d=r.getBoundingClientRect();i.b.setChartRect(a.id,Object.assign({density:1},d.toJSON()))},t.prototype.render=function(){return Object(a.j)("sc-webgl-context",null,Object(a.j)("div",{id:"test-container",style:{width:s.a.width+"px",height:s.a.height+"px"}}))},Object.defineProperty(t.prototype,"el",{get:function(){return Object(a.i)(this)},enumerable:!1,configurable:!0}),t}()}}]);