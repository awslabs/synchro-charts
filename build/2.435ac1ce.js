(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{1022:function(e,r,n){"use strict";n.d(r,"a",(function(){return f})),n.d(r,"b",(function(){return g})),n.d(r,"c",(function(){return c})),n.d(r,"d",(function(){return u})),n.d(r,"e",(function(){return d})),n.d(r,"f",(function(){return s}));var t=n(64),o=n(139),a=n(1021),i=n(1025),l=n(1026),u=function(e){var r=l.a.get(e);return null==r&&console.error("provided an invalid color string, '"+e+"'"),null==r?[0,0,0]:r.value},s=function(e,r){var n=u(e.color||"black"),t=n[0],a=n[1],i=n[2];return Object(o.a)(e,r).map((function(e){return[e.x,e.y,t,a,i]}))},c=function(e){var r=e.scene,n=e.container,t=e.viewport,o=e.toClipSpace,l=e.onUpdate,u=new a.d(o(t.start.getTime()),o(t.end.getTime()),t.yMax,t.yMin,.1,1e3);return u.position.z=500,{toClipSpace:o,scene:r,container:n,id:Object(i.a)(),camera:u,dispose:function(){return function(e){e.children.forEach((function(e){try{var r=e;r.geometry.dispose(),(Array.isArray(r.material)?r.material:[r.material]).forEach((function(e){e.dispose()}))}catch(r){throw new Error("\n        scene currently does not support objects of type "+e.constructor.name+"\n        and does not know how to dispose of it.\n      ")}}))}(r)},viewportGroup:t.group,updateViewPort:function(e){var r=e.start,n=e.end,t=function(e,r){var n={};for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&r.indexOf(t)<0&&(n[t]=e[t]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(t=Object.getOwnPropertySymbols(e);o<t.length;o++)r.indexOf(t[o])<0&&Object.prototype.propertyIsEnumerable.call(e,t[o])&&(n[t[o]]=e[t[o]])}return n}(e,["start","end"]);u.left=o(r.getTime()),u.right=o(n.getTime()),u.updateProjectionMatrix(),l&&l(Object.assign({start:r,end:n},t))}}},d=function(e){return e.map((function(e){return Object(o.a)(e,e.resolution).length})).reduce((function(e,r){return e+r}),0)},p=function(e){return e<10*t.c?1:e<t.a?t.d/10:e<7*t.a?t.d:e<t.e?t.c:e<30*t.e?30*t.c:t.a},f=function(e){var r=e.end.getTime()-e.start.getTime(),n=e.start.getTime()-.25*r,t=p(r);return function(e){return Math.floor((e-n)/t)}},h=function(e,r){return Math.abs(r(e.getTime()))>=Math.pow(10,7)},g=function(e,r){var n=h(e.start,r)||h(e.end,r),t=e.end.getTime()-e.start.getTime(),o=r(e.end.getTime())-r(e.start.getTime());return n||t>o&&o<3e3}},1025:function(e,r,n){"use strict";n.d(r,"a",(function(){return u}));for(var t=n(1019),o=Object(t.b)((function(e){var r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(r){var n=new Uint8Array(16);e.exports=function(){return r(n),n}}else{var t=new Array(16);e.exports=function(){for(var e,r=0;r<16;r++)0==(3&r)&&(e=4294967296*Math.random()),t[r]=e>>>((3&r)<<3)&255;return t}}})),a=[],i=0;i<256;++i)a[i]=(i+256).toString(16).substr(1);var l=function(e,r){var n=r||0,t=a;return[t[e[n++]],t[e[n++]],t[e[n++]],t[e[n++]],"-",t[e[n++]],t[e[n++]],"-",t[e[n++]],t[e[n++]],"-",t[e[n++]],t[e[n++]],"-",t[e[n++]],t[e[n++]],t[e[n++]],t[e[n++]],t[e[n++]],t[e[n++]]].join("")},u=function(e,r,n){var t=r&&n||0;"string"==typeof e&&(r="binary"===e?new Array(16):null,e=null);var a=(e=e||{}).random||(e.rng||o)();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,r)for(var i=0;i<16;++i)r[t+i]=a[i];return r||l(a)}},1026:function(e,r,n){"use strict";n.d(r,"a",(function(){return l}));var t=n(1019),o={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},a=function(e){return!(!e||"string"==typeof e)&&(e instanceof Array||Array.isArray(e)||e.length>=0&&(e.splice instanceof Function||Object.getOwnPropertyDescriptor(e,e.length-1)&&"String"!==e.constructor.name))},i=Object(t.b)((function(e){var r=Array.prototype.concat,n=Array.prototype.slice,t=e.exports=function(e){for(var t=[],o=0,i=e.length;o<i;o++){var l=e[o];a(l)?t=r.call(t,n.call(l)):t.push(l)}return t};t.wrap=function(e){return function(){return e(t(arguments))}}})),l=Object(t.b)((function(e){var r={};for(var n in o)o.hasOwnProperty(n)&&(r[o[n]]=n);var t=e.exports={to:{},get:{}};function a(e,r,n){return Math.min(Math.max(r,e),n)}function l(e){var r=e.toString(16).toUpperCase();return r.length<2?"0"+r:r}t.get=function(e){var r,n;switch(e.substring(0,3).toLowerCase()){case"hsl":r=t.get.hsl(e),n="hsl";break;case"hwb":r=t.get.hwb(e),n="hwb";break;default:r=t.get.rgb(e),n="rgb"}return r?{model:n,value:r}:null},t.get.rgb=function(e){if(!e)return null;var r,n,t,i=[0,0,0,1];if(r=e.match(/^#([a-f0-9]{6})([a-f0-9]{2})?$/i)){for(t=r[2],r=r[1],n=0;n<3;n++){var l=2*n;i[n]=parseInt(r.slice(l,l+2),16)}t&&(i[3]=parseInt(t,16)/255)}else if(r=e.match(/^#([a-f0-9]{3,4})$/i)){for(t=(r=r[1])[3],n=0;n<3;n++)i[n]=parseInt(r[n]+r[n],16);t&&(i[3]=parseInt(t+t,16)/255)}else if(r=e.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)){for(n=0;n<3;n++)i[n]=parseInt(r[n+1],0);r[4]&&(i[3]=parseFloat(r[4]))}else{if(!(r=e.match(/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)))return(r=e.match(/(\D+)/))?"transparent"===r[1]?[0,0,0,0]:(i=o[r[1]])?(i[3]=1,i):null:null;for(n=0;n<3;n++)i[n]=Math.round(2.55*parseFloat(r[n+1]));r[4]&&(i[3]=parseFloat(r[4]))}for(n=0;n<3;n++)i[n]=a(i[n],0,255);return i[3]=a(i[3],0,1),i},t.get.hsl=function(e){if(!e)return null;var r=e.match(/^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?[\d\.]+)\s*)?\)$/);if(r){var n=parseFloat(r[4]);return[(parseFloat(r[1])+360)%360,a(parseFloat(r[2]),0,100),a(parseFloat(r[3]),0,100),a(isNaN(n)?1:n,0,1)]}return null},t.get.hwb=function(e){if(!e)return null;var r=e.match(/^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);if(r){var n=parseFloat(r[4]);return[(parseFloat(r[1])%360+360)%360,a(parseFloat(r[2]),0,100),a(parseFloat(r[3]),0,100),a(isNaN(n)?1:n,0,1)]}return null},t.to.hex=function(){var e=i(arguments);return"#"+l(e[0])+l(e[1])+l(e[2])+(e[3]<1?l(Math.round(255*e[3])):"")},t.to.rgb=function(){var e=i(arguments);return e.length<4||1===e[3]?"rgb("+Math.round(e[0])+", "+Math.round(e[1])+", "+Math.round(e[2])+")":"rgba("+Math.round(e[0])+", "+Math.round(e[1])+", "+Math.round(e[2])+", "+e[3]+")"},t.to.rgb.percent=function(){var e=i(arguments),r=Math.round(e[0]/255*100),n=Math.round(e[1]/255*100),t=Math.round(e[2]/255*100);return e.length<4||1===e[3]?"rgb("+r+"%, "+n+"%, "+t+"%)":"rgba("+r+"%, "+n+"%, "+t+"%, "+e[3]+")"},t.to.hsl=function(){var e=i(arguments);return e.length<4||1===e[3]?"hsl("+e[0]+", "+e[1]+"%, "+e[2]+"%)":"hsla("+e[0]+", "+e[1]+"%, "+e[2]+"%, "+e[3]+")"},t.to.hwb=function(){var e=i(arguments),r="";return e.length>=4&&1!==e[3]&&(r=", "+e[3]),"hwb("+e[0]+", "+e[1]+"%, "+e[2]+"%"+r+")"},t.to.keyword=function(e){return r[e.slice(0,3)]}}))},1027:function(e,r,n){"use strict";n.d(r,"a",(function(){return s})),n.d(r,"b",(function(){return h})),n.d(r,"c",(function(){return p})),n.d(r,"d",(function(){return m})),n.d(r,"e",(function(){return c})),n.d(r,"f",(function(){return b}));var t=n(8),o=n(69),a=n(54),i=n(1021),l=n(1022),u=function(e){return"\nvarying vec3 vColor;\n"+(e?"varying float positionY;":"")+"\nattribute vec3 pointColor;\nuniform float pointDiameter;\nuniform float devicePixelRatio;\n\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, 0.0, 1.0);\n  gl_PointSize = pointDiameter * devicePixelRatio;\n  vColor = pointColor;\n  "+(e?"positionY = position.y;":"")+"\n}\n"},s=13,c=function(e){if(0===e.length)return[];var r=Object(o.c)(e),n=Object(o.o)(r).reverse(),a=[],i=new Set;n.forEach((function(e,r){var u=e.value;if(n[r].comparisonOperator!==t.a.EQUAL)if(0!==r){var s=n[r-1],c=s.value,d=(c+u)/2,p=Object(o.a)(d,n);if(null!=p&&!i.has(s.value)){var f=Object(l.d)(p.color);w=f[0],k=f[1],O=f[2],s.comparisonOperator===t.a.EQUAL&&(s.value,n[r].value),a.push({upper:c,lower:u,color:[w,k,O]}),i.add(s.value)}if(r!==n.length-1){var h=n[r+1].value;if(d=(u+h)/2,null!=(p=Object(o.a)(d,n))&&!i.has(u)){var g=Object(l.d)(p.color);w=g[0],k=g[1],O=g[2],a.push({upper:u,lower:h,color:[w,k,O]}),i.add(e.value)}}else if(d=(u+Number.MIN_SAFE_INTEGER)/2,null!=(p=Object(o.a)(d,n))&&!i.has(u)){var v=Object(l.d)(p.color);w=v[0],k=v[1],O=v[2],a.push({lower:Number.MIN_SAFE_INTEGER,upper:u,color:[w,k,O]})}}else{var m=(Number.MAX_SAFE_INTEGER+u)/2,b=Object(o.a)(m,n);if(null!=b){var y=Object(l.d)(b.color),w=y[0],k=y[1],O=y[2];a.push({upper:Number.MAX_SAFE_INTEGER,lower:u,color:[w,k,O]})}}else{var M=Object(l.d)(n[r].color);w=M[0],k=M[1],O=M[2];a.push({upper:u,lower:u,color:[w,k,O]})}}));for(var u=a[a.length-1];a.length<s;){var c=n[n.length-1].value,d=Number.MIN_SAFE_INTEGER+c/2,p=Object(o.a)(d,n);if(null==p)a.push(u);else{var f=Object(l.d)(p.color),h=f[0],g=f[1],v=f[2];u={lower:Number.MIN_SAFE_INTEGER,upper:c,color:[h,g,v]},a.push(u)}}return a},d="\n#define MAX_NUM_TOTAL_THRESHOLD_BAND "+s+"\n\nstruct Band {\n  float upper;\n  float lower;\n  vec3 color;\n};\n\nvarying vec3 vColor;\nvarying float positionY;\n\nuniform Band thresholdBands[MAX_NUM_TOTAL_THRESHOLD_BAND];\nuniform float yPixelDensity;\n\nvoid main() {\n  // calculate position such that the center is (0, 0) in a region of [-1, 1] x [-1, 1]\n  vec2 pos = 2.0 * gl_PointCoord.xy - 1.0;\n  // r = distance squared from the origin of the point being rendered\n  float r = dot(pos, pos);\n  if (r > 1.0) {\n    discard;\n  }\n  float alpha = 1.0 - smoothstep(0.5, 1.0, sqrt(r));\n\n  for(int i = 0; i < MAX_NUM_TOTAL_THRESHOLD_BAND; i++) {\n    bool isRangeBreached = positionY >= thresholdBands[i].lower && positionY <= thresholdBands[i].upper;\n    bool isEqualsThreshold = thresholdBands[i].lower == thresholdBands[i].upper;\n    bool isEqualsThresholdBreached = positionY == thresholdBands[i].upper;\n\n    if (isRangeBreached || (isEqualsThreshold && isEqualsThresholdBreached)) {\n       gl_FragColor = vec4(thresholdBands[i].color /255.0, alpha);\n       break;\n    } else {\n       gl_FragColor = vec4(vColor, alpha);\n    }\n  }\n}\n",p=0,f=function(e){return 0===(null!=e[0]?e[0].resolution:null)?4:6.25},h=2,g=function(e,r,n){var t=r.filter(a.c).map((function(e){return Object(l.f)(e,e.resolution)})).flat(),o=e.attributes,i=o.position,u=o.pointColor;t.forEach((function(e,r){var t=e[0],o=e[1],a=e[2],l=e[3],s=e[4];i.array[r*h]=n(t),i.array[r*h+1]=o,u.array[3*r]=a,u.array[3*r+1]=l,u.array[3*r+2]=s})),e.setDrawRange(0,t.length),i.needsUpdate=!0,u.needsUpdate=!0},v=function(e,r){e.setAttribute("position",new i.a(new Float32Array(r*h),h)),e.setAttribute("pointColor",new i.a(new Uint8Array(3*r),3,!0))},m=function(e){var r=e.toClipSpace,n=e.dataStreams,t=e.minBufferSize,o=e.bufferFactor,a=e.thresholdOptions,s=e.thresholds,p=Math.max(t,Object(l.e)(n)*o),h=new i.k;v(h,p),g(h,n,r);var m=a.showColor,b=void 0===m||m,y=new i.l({vertexShader:u(b&&s.length>0),fragmentShader:b&&0!==s.length?d:"\nvarying vec3 vColor;\n\nvoid main() {\n  // calculate position such that the center is (0, 0) in a region of [-1, 1] x [-1, 1]\n  vec2 pos = 2.0 * gl_PointCoord.xy - 1.0;\n  // r = distance squared from the origin of the point being rendered\n  float r = dot(pos, pos);\n  if (r > 1.0) {\n    discard;\n  }\n  float alpha = 1.0 - smoothstep(0.5, 1.0, sqrt(r));\n  gl_FragColor = vec4(vColor, alpha);\n}\n",transparent:!0,uniforms:{pointDiameter:{value:f(n)},devicePixelRatio:{value:window.devicePixelRatio},thresholdBands:{value:c(s)}}}),w=new i.e(h,y);return w.frustumCulled=!1,w},b=function(e,r,n,t){void 0===t&&(t=!0),r.material.uniforms.pointDiameter.value=f(e),r.material.uniforms.devicePixelRatio.value=window.devicePixelRatio,t&&g(r.geometry,e,n)}}}]);