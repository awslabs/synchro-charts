(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{923:function(t,e,r){"use strict";r.r(e),r.d(e,"sc_webgl_chart_dynamic_charts",(function(){return f}));var n=r(13),i=r(30),o=(r(973),r(979)),a=function(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),i=0;for(e=0;e<r;e++)for(var o=arguments[e],a=0,c=o.length;a<c;a++,i++)n[i]=o[a];return n},c=new Date(1998,0,0),s=new Date(2e3,0,1),h={x:new Date((c.getTime()+s.getTime())/2).getTime(),y:250},d=function(t,e){return new Array(e).fill(0).map((function(e,r){return{x:t.x,y:t.y+250*r}}))},u=1,f=function(){function t(t){var e=this;Object(n.l)(this,t),this.chartKeys=[],this.width=500,this.xOffset=0,this.shiftLeft=function(){e.xOffset-=100},this.shiftRight=function(){e.xOffset+=100},this.increaseWidth=function(){e.width+=100},this.decreaseWidth=function(){e.width>100&&(e.width-=100)},this.addChartAtFront=function(){var t=Object(o.a)();e.chartKeys=a([{key:t,data:[{id:t,color:"black",name:"test stream",data:d(h,u),resolution:0,dataType:i.b.NUMBER}]}],e.chartKeys),u+=1},this.addChartAtBack=function(){var t=Object(o.a)();e.chartKeys=a(e.chartKeys,[{key:t,data:[{id:t,color:"black",name:"test stream",data:d(h,u),resolution:0,dataType:i.b.NUMBER}]}]),u+=1},this.removeFrontChart=function(){e.chartKeys.length>0&&(e.chartKeys=e.chartKeys.slice(1))},this.removeBackChart=function(){e.chartKeys.length>0&&(e.chartKeys=e.chartKeys.slice(0,-1))}}return t.prototype.render=function(){var t=this;return Object(n.j)("div",{class:"synchro-chart-tests"},Object(n.j)("button",{id:"shift-right",onClick:this.shiftRight},"Shift Right"),Object(n.j)("button",{id:"shift-left",onClick:this.shiftLeft},"Shift Left"),Object(n.j)("button",{id:"increase-width",onClick:this.increaseWidth},"Increase Width"),Object(n.j)("button",{id:"decrease-width",onClick:this.decreaseWidth},"Decrease Width"),Object(n.j)("button",{id:"add-chart-to-front",onClick:this.addChartAtFront},"Add Chart To Front"),Object(n.j)("button",{id:"add-chart-to-back",onClick:this.addChartAtBack},"Add Chart To Back"),Object(n.j)("button",{id:"remove-chart-from-back",onClick:this.removeBackChart},"Remove Chart From Back"),Object(n.j)("button",{id:"remove-chart-from-front",onClick:this.removeFrontChart},"Remove Chart From Front"),Object(n.j)("hr",null),this.chartKeys.map((function(e){var r=e.key,i=e.data;return Object(n.j)("div",{key:r,style:{marginLeft:t.xOffset+"px",width:t.width+"px",height:"500px"}},Object(n.j)("sc-line-chart",{dataStreams:i,widgetId:r,viewport:{start:c,end:s,yMin:0,yMax:5e3}}))})),Object(n.j)("sc-webgl-context",null))},t}()},973:function(t,e,r){"use strict";(function(t){r.d(e,"a",(function(){return n})),r.d(e,"b",(function(){return o})),r.d(e,"c",(function(){return i}));var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:void 0!==t?t:"undefined"!=typeof self?self:{};function i(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function o(t,e,r){return t(r={path:e,exports:{},require:function(t,e){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}()}},r.exports),r.exports}}).call(this,r(23))},979:function(t,e,r){"use strict";r.d(e,"a",(function(){return s}));for(var n=r(973),i=Object(n.b)((function(t){var e="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(e){var r=new Uint8Array(16);t.exports=function(){return e(r),r}}else{var n=new Array(16);t.exports=function(){for(var t,e=0;e<16;e++)0==(3&e)&&(t=4294967296*Math.random()),n[e]=t>>>((3&e)<<3)&255;return n}}})),o=[],a=0;a<256;++a)o[a]=(a+256).toString(16).substr(1);var c=function(t,e){var r=e||0,n=o;return[n[t[r++]],n[t[r++]],n[t[r++]],n[t[r++]],"-",n[t[r++]],n[t[r++]],"-",n[t[r++]],n[t[r++]],"-",n[t[r++]],n[t[r++]],"-",n[t[r++]],n[t[r++]],n[t[r++]],n[t[r++]],n[t[r++]],n[t[r++]]].join("")},s=function(t,e,r){var n=e&&r||0;"string"==typeof t&&(e="binary"===t?new Array(16):null,t=null);var o=(t=t||{}).random||(t.rng||i)();if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,e)for(var a=0;a<16;++a)e[n+a]=o[a];return e||c(o)}}}]);