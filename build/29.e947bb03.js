(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{1037:function(t,e,r){"use strict";r.d(e,"a",(function(){return n}));var n=function(t,e){return Math.abs(t(new Date(e).getTime())-t(new Date(0).getTime()))}},1046:function(t,e,r){"use strict";r.d(e,"a",(function(){return b})),r.d(e,"b",(function(){return m}));var n=r(70),a=r(55),o=r(1029),i=r(1031),s=r(1037),c=function(t){var e=t.toClipSpace,r=t.resolution,n=t.numDataStreams;return(Object(s.a)(e,r)-function(t,e){return Object(s.a)(t,.16666666666666666*e)}(e,r))/n},u=function(t,e){if(0===t.length)return 0;var r=t[0].resolution;return c({toClipSpace:e,numDataStreams:t.length,resolution:r})},h=function(t){var e=t.dataStreams,r=t.mesh,o=t.toClipSpace,s=t.thresholds,c=t.thresholdOptions,h=e.filter(a.c).map((function(t){return Object(i.f)(t,t.resolution)}));r.count=function(t){return t.reduce((function(t,e){return t+e.length}),0)}(h);var d=r.geometry.attributes,l=d.color,p=d.bar,f=0,b=0;h.forEach((function(t,r){t.forEach((function(t){var a=t[0],h=t[1],d=t[2],m=t[3],v=t[4];p.array[f]=o(a)-r*u(e,o),p.array[f+1]=h;var w=Object(n.a)(h,s);if(null!=w&&c.showColor){var g=Object(i.d)(w.color),S=g[0],y=g[1],O=g[2];l.array[b]=S,l.array[b+1]=y,l.array[b+2]=O}else l.array[b]=d,l.array[b+1]=m,l.array[b+2]=v;b+=3,f+=2}))})),p.needsUpdate=!0,l.needsUpdate=!0},d=[0,0,0,1,1,0,0,1,1,0,1,1],l=function(t,e){t.setAttribute("position",new o.a(new Float32Array(d),2)),t.setAttribute("bar",new o.j(new Float32Array(2*e),2,!1)),t.setAttribute("color",new o.j(new Uint8Array(3*e),3,!0))},p=function(t){var e=t.dataStreams,r=t.toClipSpace,n=t.bufferFactor,a=t.minBufferSize,s=t.thresholdOptions,c=t.thresholds,d=new o.c,p=Math.max(a,Object(i.e)(e)*n);l(d,p);var f=new o.f({vertexShader:"\nprecision highp float;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float width;\nattribute vec2 bar;\nattribute vec2 position;\nattribute vec3 color;\nvarying vec3 vColor;\n\nvoid main() {\n  // Negative width here because we want to render the bars' width to the left side starting from its x position.\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * -width + bar.x, position.y * bar.y, 0.0, 1.0);\n  vColor = color;\n}\n",fragmentShader:"\nprecision highp float;\nvarying vec3 vColor;\n\nvoid main() {\n  gl_FragColor = vec4(vColor, 1.0);\n}\n",side:o.b,transparent:!1,uniforms:{width:{value:u(e,r)}}}),b=new o.i(d,f,p);return h({dataStreams:e,mesh:b,toClipSpace:r,thresholds:c,thresholdOptions:s}),b.frustumCulled=!1,b},f=function(t){var e=t.bars,r=t.dataStreams,n=t.toClipSpace,a=t.hasDataChanged,o=t.thresholdOptions,i=t.thresholds;a&&(e.material.uniforms.width.value=u(r,n),h({dataStreams:r,mesh:e,toClipSpace:n,thresholds:i,thresholdOptions:o}))},b=function(t){var e=t.dataStreams,r=t.container,n=t.viewport,a=t.bufferFactor,s=t.minBufferSize,c=t.onUpdate,u=t.thresholdOptions,h=t.thresholds,d=new o.g,l=Object(i.a)(n);return d.add(p({dataStreams:e,toClipSpace:l,bufferFactor:a,minBufferSize:s,thresholdOptions:u,thresholds:h})),Object(i.c)({scene:d,viewport:n,container:r,toClipSpace:l,onUpdate:c})},m=function(t){var e=t.scene,r=t.dataStreams,n=t.hasDataChanged,a=t.minBufferSize,o=t.bufferFactor,s=t.viewport,c=t.container,u=t.onUpdate,h=t.chartSize,d=t.thresholdOptions,l=t.thresholds,p=t.hasAnnotationChanged,m=e.scene.children[0];return function(t){return t.geometry.attributes.bar.array.length/2}(m)<Object(i.e)(r)||Object(i.b)(s,e.toClipSpace)||p?b({onUpdate:u,dataStreams:r,container:c,viewport:s,minBufferSize:a,bufferFactor:o,chartSize:h,thresholdOptions:d,thresholds:l}):(f({bars:m,dataStreams:r,toClipSpace:e.toClipSpace,hasDataChanged:n,thresholdOptions:d,thresholds:l}),e)}},953:function(t,e,r){"use strict";r.r(e),r.d(e,"sc_single_bar",(function(){return p}));var n=r(13),a=(r(14),r(39)),o=(r(142),r(65)),i=(r(70),r(55),r(77),r(143),r(1029),r(1038)),s=(r(1030),r(1033),r(1034),r(1031),r(1037),r(1040)),c=r(1046),u=new Date(2e3,0,0),h=new Date(2e3,0,1),d=h.getTime()-u.getTime(),l={x:u.getTime()+d/3,y:50},p=function(){function t(t){Object(n.l)(this,t)}return t.prototype.componentDidLoad=function(){var t,e=this.el.querySelector("#test-container"),r=Object(c.a)({viewport:{start:u,end:h,yMin:0,yMax:100},dataStreams:[{id:"test-stream",name:"test-stream-name",color:"black",data:[],aggregates:(t={},t[o.a]=[l],t),resolution:o.a,dataType:a.b.NUMBER}],container:e,chartSize:s.a,minBufferSize:100,bufferFactor:2,thresholdOptions:{showColor:!1},thresholds:[]});i.b.addChartScene({manager:r});var n=e.getBoundingClientRect();i.b.setChartRect(r.id,Object.assign({density:1},n.toJSON()))},t.prototype.render=function(){return Object(n.j)("sc-webgl-context",null,Object(n.j)("div",{id:"test-container",style:{width:s.a.width+"px",height:s.a.height+"px"}}))},Object.defineProperty(t.prototype,"el",{get:function(){return Object(n.i)(this)},enumerable:!1,configurable:!0}),t}()}}]);