(window.webpackJsonp=window.webpackJsonp||[]).push([[55],{1029:function(t,e,n){"use strict";n.d(e,"a",(function(){return s})),n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return o})),n.d(e,"d",(function(){return d})),n.d(e,"e",(function(){return a})),n.d(e,"f",(function(){return r})),n.d(e,"g",(function(){return c})),n(8);var a=0,r=5e3,i=new Date(2e3,0,0,0,0),c=new Date(2e3,0,0,0,10),d=2500,o="Warning",s=(new Date(i.getTime()+1/3*(c.getTime()-i.getTime())),{x:(i.getTime()+c.getTime())/2,y:d})},996:function(t,e,n){"use strict";n.r(e),n.d(e,"sc_webgl_line_chart_dynamic_data_streams",(function(){return h}));var a=n(14),r=(n(8),n(38)),i=(n(138),n(64)),c=n(1029),d=new Date(1998,0,0),o=new Date(2e3,0,1),s=o.getTime()-d.getTime(),m=new Date(d.getTime()+s*(1/6)).getTime(),u=new Date(d.getTime()+s*(1/3)).getTime(),g=new Date(d.getTime()+.5*s).getTime(),h=function(){function t(t){var e=this;Object(a.l)(this,t),this.dataStreams=[],this.addStream=function(){var t,n={x:m,y:c.d},a={x:u,y:c.d},d={x:g,y:c.d},o="stream-"+(e.dataStreams.length+1);e.dataStreams=function(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;var a=Array(t),r=0;for(e=0;e<n;e++)for(var i=arguments[e],c=0,d=i.length;c<d;c++,r++)a[r]=i[c];return a}([{id:o,color:"black",name:o+"-name",aggregates:(t={},t[i.c]=[n,a,d],t),data:[],resolution:i.c,dataType:r.b.NUMBER}],e.dataStreams)},this.removeStream=function(){var t=e.dataStreams,n=(t[0],t.slice(1));e.dataStreams=n}}return t.prototype.render=function(){return Object(a.j)("div",{class:"synchro-chart-tests"},Object(a.j)("button",{id:"add-stream",onClick:this.addStream},"Add Stream"),Object(a.j)("button",{id:"remove-stream",onClick:this.removeStream},"Remove Stream"),Object(a.j)("br",null),Object(a.j)("br",null),Object(a.j)("div",{id:"chart-container",style:{marginTop:"20px",width:"500px",height:"500px"}},Object(a.j)("sc-line-chart",{widgetId:"widget-id",dataStreams:this.dataStreams,size:{height:500,width:500},viewport:{start:d,end:o,yMin:0,yMax:5e3}})),Object(a.j)("sc-webgl-context",null))},t}()}}]);