(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{976:function(e,r,t){"use strict";t.d(r,"a",(function(){return p})),t.d(r,"b",(function(){return g})),t.d(r,"c",(function(){return c})),t.d(r,"d",(function(){return l})),t.d(r,"e",(function(){return d})),t.d(r,"f",(function(){return u}));var n=t(45),a=t(102),o=t(975),i=t(979),s=t(980),l=function(e){var r=s.a.get(e);return null==r&&console.error("provided an invalid color string, '"+e+"'"),null==r?[0,0,0]:r.value},u=function(e,r){var t=l(e.color||"black"),n=t[0],o=t[1],i=t[2];return Object(a.a)(e,r).map((function(e){return[e.x,e.y,n,o,i]}))},c=function(e){var r=e.scene,t=e.container,n=e.viewport,a=e.toClipSpace,s=e.onUpdate,l=new o.d(a(n.start.getTime()),a(n.end.getTime()),n.yMax,n.yMin,.1,1e3);return l.position.z=500,{toClipSpace:a,scene:r,container:t,id:Object(i.a)(),camera:l,dispose:function(){return function(e){e.children.forEach((function(e){try{var r=e;r.geometry.dispose(),(Array.isArray(r.material)?r.material:[r.material]).forEach((function(e){e.dispose()}))}catch(r){throw new Error("\n        scene currently does not support objects of type "+e.constructor.name+"\n        and does not know how to dispose of it.\n      ")}}))}(r)},viewportGroup:n.group,updateViewPort:function(e){var r=e.start,t=e.end,n=function(e,r){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&r.indexOf(n)<0&&(t[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(n=Object.getOwnPropertySymbols(e);a<n.length;a++)r.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(t[n[a]]=e[n[a]])}return t}(e,["start","end"]);l.left=a(r.getTime()),l.right=a(t.getTime()),l.updateProjectionMatrix(),s&&s(Object.assign({start:r,end:t},n))}}},d=function(e){return e.map((function(e){return Object(a.a)(e,e.resolution).length})).reduce((function(e,r){return e+r}),0)},h=function(e){return e<10*n.c?1:e<n.a?n.d/10:e<7*n.a?n.d:e<n.e?n.c:e<30*n.e?30*n.c:n.a},p=function(e){var r=e.end.getTime()-e.start.getTime(),t=e.start.getTime()-.25*r,n=h(r);return function(e){return Math.floor((e-t)/n)}},f=function(e,r){return Math.abs(r(e.getTime()))>=Math.pow(10,7)},g=function(e,r){var t=f(e.start,r)||f(e.end,r),n=e.end.getTime()-e.start.getTime(),a=r(e.end.getTime())-r(e.start.getTime());return t||n>a&&a<3e3}},979:function(e,r,t){"use strict";t.d(r,"a",(function(){return l}));for(var n=t(973),a=Object(n.b)((function(e){var r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(r){var t=new Uint8Array(16);e.exports=function(){return r(t),t}}else{var n=new Array(16);e.exports=function(){for(var e,r=0;r<16;r++)0==(3&r)&&(e=4294967296*Math.random()),n[r]=e>>>((3&r)<<3)&255;return n}}})),o=[],i=0;i<256;++i)o[i]=(i+256).toString(16).substr(1);var s=function(e,r){var t=r||0,n=o;return[n[e[t++]],n[e[t++]],n[e[t++]],n[e[t++]],"-",n[e[t++]],n[e[t++]],"-",n[e[t++]],n[e[t++]],"-",n[e[t++]],n[e[t++]],"-",n[e[t++]],n[e[t++]],n[e[t++]],n[e[t++]],n[e[t++]],n[e[t++]]].join("")},l=function(e,r,t){var n=r&&t||0;"string"==typeof e&&(r="binary"===e?new Array(16):null,e=null);var o=(e=e||{}).random||(e.rng||a)();if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,r)for(var i=0;i<16;++i)r[n+i]=o[i];return r||s(o)}},980:function(e,r,t){"use strict";t.d(r,"a",(function(){return s}));var n=t(973),a={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},o=function(e){return!(!e||"string"==typeof e)&&(e instanceof Array||Array.isArray(e)||e.length>=0&&(e.splice instanceof Function||Object.getOwnPropertyDescriptor(e,e.length-1)&&"String"!==e.constructor.name))},i=Object(n.b)((function(e){var r=Array.prototype.concat,t=Array.prototype.slice,n=e.exports=function(e){for(var n=[],a=0,i=e.length;a<i;a++){var s=e[a];o(s)?n=r.call(n,t.call(s)):n.push(s)}return n};n.wrap=function(e){return function(){return e(n(arguments))}}})),s=Object(n.b)((function(e){var r={};for(var t in a)a.hasOwnProperty(t)&&(r[a[t]]=t);var n=e.exports={to:{},get:{}};function o(e,r,t){return Math.min(Math.max(r,e),t)}function s(e){var r=e.toString(16).toUpperCase();return r.length<2?"0"+r:r}n.get=function(e){var r,t;switch(e.substring(0,3).toLowerCase()){case"hsl":r=n.get.hsl(e),t="hsl";break;case"hwb":r=n.get.hwb(e),t="hwb";break;default:r=n.get.rgb(e),t="rgb"}return r?{model:t,value:r}:null},n.get.rgb=function(e){if(!e)return null;var r,t,n,i=[0,0,0,1];if(r=e.match(/^#([a-f0-9]{6})([a-f0-9]{2})?$/i)){for(n=r[2],r=r[1],t=0;t<3;t++){var s=2*t;i[t]=parseInt(r.slice(s,s+2),16)}n&&(i[3]=parseInt(n,16)/255)}else if(r=e.match(/^#([a-f0-9]{3,4})$/i)){for(n=(r=r[1])[3],t=0;t<3;t++)i[t]=parseInt(r[t]+r[t],16);n&&(i[3]=parseInt(n+n,16)/255)}else if(r=e.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)){for(t=0;t<3;t++)i[t]=parseInt(r[t+1],0);r[4]&&(i[3]=parseFloat(r[4]))}else{if(!(r=e.match(/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)))return(r=e.match(/(\D+)/))?"transparent"===r[1]?[0,0,0,0]:(i=a[r[1]])?(i[3]=1,i):null:null;for(t=0;t<3;t++)i[t]=Math.round(2.55*parseFloat(r[t+1]));r[4]&&(i[3]=parseFloat(r[4]))}for(t=0;t<3;t++)i[t]=o(i[t],0,255);return i[3]=o(i[3],0,1),i},n.get.hsl=function(e){if(!e)return null;var r=e.match(/^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?[\d\.]+)\s*)?\)$/);if(r){var t=parseFloat(r[4]);return[(parseFloat(r[1])+360)%360,o(parseFloat(r[2]),0,100),o(parseFloat(r[3]),0,100),o(isNaN(t)?1:t,0,1)]}return null},n.get.hwb=function(e){if(!e)return null;var r=e.match(/^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);if(r){var t=parseFloat(r[4]);return[(parseFloat(r[1])%360+360)%360,o(parseFloat(r[2]),0,100),o(parseFloat(r[3]),0,100),o(isNaN(t)?1:t,0,1)]}return null},n.to.hex=function(){var e=i(arguments);return"#"+s(e[0])+s(e[1])+s(e[2])+(e[3]<1?s(Math.round(255*e[3])):"")},n.to.rgb=function(){var e=i(arguments);return e.length<4||1===e[3]?"rgb("+Math.round(e[0])+", "+Math.round(e[1])+", "+Math.round(e[2])+")":"rgba("+Math.round(e[0])+", "+Math.round(e[1])+", "+Math.round(e[2])+", "+e[3]+")"},n.to.rgb.percent=function(){var e=i(arguments),r=Math.round(e[0]/255*100),t=Math.round(e[1]/255*100),n=Math.round(e[2]/255*100);return e.length<4||1===e[3]?"rgb("+r+"%, "+t+"%, "+n+"%)":"rgba("+r+"%, "+t+"%, "+n+"%, "+e[3]+")"},n.to.hsl=function(){var e=i(arguments);return e.length<4||1===e[3]?"hsl("+e[0]+", "+e[1]+"%, "+e[2]+"%)":"hsla("+e[0]+", "+e[1]+"%, "+e[2]+"%, "+e[3]+")"},n.to.hwb=function(){var e=i(arguments),r="";return e.length>=4&&1!==e[3]&&(r=", "+e[3]),"hwb("+e[0]+", "+e[1]+"%, "+e[2]+"%"+r+")"},n.to.keyword=function(e){return r[e.slice(0,3)]}}))},984:function(e,r,t){"use strict";t.d(r,"a",(function(){return n}));var n=function(e,r){return Math.abs(e(new Date(r).getTime())-e(new Date(0).getTime()))}},990:function(e,r,t){"use strict";t.d(r,"a",(function(){return s})),t.d(r,"b",(function(){return l})),t.d(r,"c",(function(){return b})),t.d(r,"d",(function(){return v})),t(101);var n=t(48),a=t(975),o=t(976),i=t(984),s=1,l=33.5,u=[213,219,219],c=[135,149,150],d=function(e){var r=e.nextX,t=e.currX,n=e.toClipSpace,a=e.alarms,o=a?a.expires:void 0;if(null!=o){var s=Object(i.a)(n,o);return null==r?s:Math.min(Object(i.a)(n,r-t),s)}return null!=r?Object(i.a)(n,r-t):Object(i.a)(n,Date.now()-t)},h=function(e){var r=e.dataStreams,t=e.mesh,a=e.toClipSpace,i=e.thresholds,h=e.thresholdOptions,p=e.chartSize,f=e.alarms,g=r.map((function(e){return Object(o.f)(e,e.resolution)}));t.count=function(e){return e.reduce((function(e,r){return e+Math.max(r.length,0)}),0)}(g);var m=t.geometry.attributes,b=m.color,v=m.status,y=0,w=0,S=s/r.length,k=l/p.height,O=S-k;g.forEach((function(e,r){var t,l=u;e.forEach((function(p,g){var m=(e[g+1]||[])[0],k=void 0===m?void 0:m,C=p[0],j=p[1];null!=t&&t!==j&&(l=l===u?c:u);var M=Object(n.a)(j,i);if(null!=M&&h.showColor){var x=Object(o.d)(M.color),z=x[0],F=x[1],A=x[2];b.array[w]=z,b.array[w+1]=F,b.array[w+2]=A}else{var T=l[0],U=l[1],q=l[2];b.array[w]=T,b.array[w+1]=U,b.array[w+2]=q}w+=3,v.array[y]=a(C),v.array[y+1]=s-S*(r+1),v.array[y+2]=d({currX:C,nextX:k,toClipSpace:a,alarms:f}),v.array[y+3]=O,y+=4,t=j}))})),v.needsUpdate=!0,b.needsUpdate=!0},p=[0,0,0,1,1,0,0,1,1,0,1,1],f=function(e,r){e.setAttribute("position",new a.a(new Float32Array(p),2)),e.setAttribute("status",new a.j(new Float32Array(4*r),4,!1)),e.setAttribute("color",new a.j(new Uint8Array(3*r),3,!0))},g=function(e){var r=e.alarms,t=e.dataStreams,n=e.toClipSpace,i=e.bufferFactor,s=e.minBufferSize,l=e.thresholdOptions,u=e.thresholds,c=e.chartSize,d=new a.c,p=Math.max(s,Object(o.e)(t)*i);f(d,p);var g=new a.f({vertexShader:"\nprecision highp float;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nattribute vec4 status;\nattribute vec2 position;\nattribute vec3 color;\nvarying vec3 vColor;\n\nvoid main() {\n  float width = status.z;\n  float height = status.w;\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x * width + status.x, position.y * height + status.y, 0.0, 1.0);\n  vColor = color;\n}\n",fragmentShader:"\nprecision highp float;\nvarying vec3 vColor;\n\nvoid main() {\n  gl_FragColor = vec4(vColor, 1.0);\n}\n",side:a.b,transparent:!1}),m=new a.i(d,g,p);return h({dataStreams:t,mesh:m,toClipSpace:n,thresholds:u,thresholdOptions:l,chartSize:c,alarms:r}),m.frustumCulled=!1,m},m=function(e){var r=e.alarms,t=e.statuses,n=e.dataStreams,a=e.toClipSpace,o=e.thresholdOptions,i=e.thresholds,s=e.chartSize,l=e.hasDataChanged,u=e.hasAnnotationChanged,c=e.hasSizeChanged;(l||u||c)&&h({dataStreams:n,mesh:t,toClipSpace:a,thresholds:i,thresholdOptions:o,chartSize:s,alarms:r})},b=function(e){var r=e.alarms,t=e.dataStreams,n=e.container,i=e.viewport,s=e.bufferFactor,l=e.minBufferSize,u=e.onUpdate,c=e.thresholdOptions,d=e.thresholds,h=e.chartSize,p=new a.g,f=Object(o.a)(i);return p.add(g({alarms:r,dataStreams:t,toClipSpace:f,bufferFactor:s,minBufferSize:l,thresholdOptions:c,thresholds:d,chartSize:h})),Object(o.c)({scene:p,viewport:i,container:n,toClipSpace:f,onUpdate:u})},v=function(e){var r=e.scene,t=e.alarms,n=e.dataStreams,a=e.minBufferSize,i=e.bufferFactor,s=e.viewport,l=e.container,u=e.onUpdate,c=e.chartSize,d=e.thresholdOptions,h=e.thresholds,p=e.hasDataChanged,f=e.hasAnnotationChanged,g=e.hasSizeChanged,v=r.scene.children[0];return function(e){return e.geometry.attributes.status.array.length/4}(v)<Object(o.e)(n)||Object(o.b)(s,r.toClipSpace)?b({onUpdate:u,dataStreams:n,alarms:t,container:l,viewport:s,minBufferSize:a,bufferFactor:i,chartSize:c,thresholdOptions:d,thresholds:h}):(m({alarms:t,statuses:v,dataStreams:n,toClipSpace:r.toClipSpace,thresholdOptions:d,thresholds:h,chartSize:c,hasDataChanged:p,hasAnnotationChanged:f,hasSizeChanged:g}),r)}}}]);