(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{1037:function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var r=function(t,e){return Math.abs(t(new Date(e).getTime())-t(new Date(0).getTime()))}},1045:function(t,e,a){"use strict";a.d(e,"a",(function(){return s})),a.d(e,"b",(function(){return c})),a.d(e,"c",(function(){return b})),a.d(e,"d",(function(){return S})),a(142);var r=a(70),n=a(1029),o=a(1031),i=a(1037),s=1,c=33.5,h=[165,165,165],u=function(t){var e=t.nextX,a=t.currX,r=t.toClipSpace,n=t.alarms,o=n?n.expires:void 0;if(null!=o){var s=Object(i.a)(r,o);return null==e?s:Math.min(Object(i.a)(r,e-a),s)}return null!=e?Object(i.a)(r,e-a):Object(i.a)(r,Date.now()-a)},l=function(t){var e=t.dataStreams,a=t.mesh,n=t.toClipSpace,i=t.thresholds,l=t.thresholdOptions,d=t.chartSize,p=t.alarms,f=e.map((function(t){return Object(o.f)(t,t.resolution)}));a.count=function(t){return t.reduce((function(t,e){return t+Math.max(e.length,0)}),0)}(f);var m=a.geometry.attributes,b=m.color,S=m.status,g=0,v=0,w=s/e.length,y=c/d.height,C=w-y;f.forEach((function(t,e){t.forEach((function(a,c){var d=(t[c+1]||[])[0],f=void 0===d?void 0:d,m=a[0],y=a[1],O=Object(r.a)(y,i);if(null!=O&&l.showColor){var j=Object(o.d)(O.color),z=j[0],x=j[1],M=j[2];b.array[v]=z,b.array[v+1]=x,b.array[v+2]=M}else{var A=h[0],B=h[1],D=h[2];b.array[v]=A,b.array[v+1]=B,b.array[v+2]=D}v+=3,S.array[g]=n(m),S.array[g+1]=s-w*(e+1),S.array[g+2]=u({currX:m,nextX:f,toClipSpace:n,alarms:p}),S.array[g+3]=C,g+=4}))})),S.needsUpdate=!0,b.needsUpdate=!0},d=[0,0,0,1,1,0,0,1,1,0,1,1],p=function(t,e){t.setAttribute("position",new n.a(new Float32Array(d),2)),t.setAttribute("status",new n.j(new Float32Array(4*e),4,!1)),t.setAttribute("color",new n.j(new Uint8Array(3*e),3,!0))},f=function(t){var e=t.alarms,a=t.dataStreams,r=t.toClipSpace,i=t.bufferFactor,s=t.minBufferSize,c=t.thresholdOptions,h=t.thresholds,u=t.chartSize,d=new n.c,f=Math.max(s,Object(o.e)(a)*i);p(d,f);var m=new n.f({vertexShader:"\nprecision highp float;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nattribute vec4 status;\nattribute vec2 position;\nattribute vec3 color;\nvarying vec3 vColor;\n\nvoid main() {\n  float width = status.z;\n  float height = status.w;\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * width + status.x, position.y * height + status.y, 0.0, 1.0);\n  vColor = color;\n}\n",fragmentShader:"\nprecision highp float;\nvarying vec3 vColor;\n\nvoid main() {\n  gl_FragColor = vec4(vColor, 1.0);\n}\n",side:n.b,transparent:!1}),b=new n.i(d,m,f);return l({dataStreams:a,mesh:b,toClipSpace:r,thresholds:h,thresholdOptions:c,chartSize:u,alarms:e}),b.frustumCulled=!1,b},m=function(t){var e=t.alarms,a=t.statuses,r=t.dataStreams,n=t.toClipSpace,o=t.thresholdOptions,i=t.thresholds,s=t.chartSize,c=t.hasDataChanged,h=t.hasAnnotationChanged,u=t.hasSizeChanged;(c||h||u)&&l({dataStreams:r,mesh:a,toClipSpace:n,thresholds:i,thresholdOptions:o,chartSize:s,alarms:e})},b=function(t){var e=t.alarms,a=t.dataStreams,r=t.container,i=t.viewport,s=t.bufferFactor,c=t.minBufferSize,h=t.onUpdate,u=t.thresholdOptions,l=t.thresholds,d=t.chartSize,p=new n.g,m=Object(o.a)(i);return p.add(f({alarms:e,dataStreams:a,toClipSpace:m,bufferFactor:s,minBufferSize:c,thresholdOptions:u,thresholds:l,chartSize:d})),Object(o.c)({scene:p,viewport:i,container:r,toClipSpace:m,onUpdate:h})},S=function(t){var e=t.scene,a=t.alarms,r=t.dataStreams,n=t.minBufferSize,i=t.bufferFactor,s=t.viewport,c=t.container,h=t.onUpdate,u=t.chartSize,l=t.thresholdOptions,d=t.thresholds,p=t.hasDataChanged,f=t.hasAnnotationChanged,S=t.hasSizeChanged,g=e.scene.children[0];return function(t){return t.geometry.attributes.status.array.length/4}(g)<Object(o.e)(r)||Object(o.b)(s,e.toClipSpace)?b({onUpdate:h,dataStreams:r,alarms:a,container:c,viewport:s,minBufferSize:n,bufferFactor:i,chartSize:u,thresholdOptions:l,thresholds:d}):(m({alarms:a,statuses:g,dataStreams:r,toClipSpace:e.toClipSpace,thresholdOptions:l,thresholds:d,chartSize:u,hasDataChanged:p,hasAnnotationChanged:f,hasSizeChanged:S}),e)}},922:function(t,e,a){"use strict";a.r(e),a.d(e,"multiple_statuses",(function(){return f}));var r=a(13),n=(a(14),a(39)),o=(a(142),a(65)),i=(a(70),a(55),a(77),a(143),a(1029),a(1038)),s=a(1045),c=(a(1030),a(1033),a(1034),a(1031),a(1037),a(1040)),h=new Date(2e3,0,0),u=new Date(2e3,0,1),l=u.getTime()-h.getTime(),d={x:h.getTime()+l/3,y:25},p={x:h.getTime()+l*(2/3),y:50},f=function(){function t(t){Object(r.l)(this,t)}return t.prototype.componentDidLoad=function(){var t,e,a=this.el.querySelector("#test-container"),r=Object(s.c)({alarms:{expires:5*o.b},viewport:{start:h,end:u,yMin:0,yMax:s.a},dataStreams:[{id:"test-stream",aggregates:(t={},t[5*o.b]=[d],t),data:[],resolution:5*o.b,name:"test-stream-name",color:"black",dataType:n.b.NUMBER},{id:"test-stream-2",aggregates:(e={},e[5*o.b]=[p],e),data:[],name:"test-stream-name-2",color:"red",resolution:5*o.b,dataType:n.b.NUMBER}],container:a,chartSize:c.a,minBufferSize:100,bufferFactor:2,thresholdOptions:{showColor:!1},thresholds:[]});i.b.addChartScene({manager:r});var l=a.getBoundingClientRect();i.b.setChartRect(r.id,Object.assign({density:1},l.toJSON()))},t.prototype.render=function(){return Object(r.j)("sc-webgl-context",null,Object(r.j)("div",{id:"test-container",style:{width:c.a.width+"px",height:c.a.height+"px"}}))},Object.defineProperty(t.prototype,"el",{get:function(){return Object(r.i)(this)},enumerable:!1,configurable:!0}),t}()}}]);