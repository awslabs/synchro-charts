(window.webpackJsonp=window.webpackJsonp||[]).push([[113],{1001:function(t,e,a){"use strict";a.r(e),a.d(e,"status_timeline_dynamic_data_streams",(function(){return h}));var r=a(14),n=a(38),o=(a(138),a(64)),i=function(){for(var t=0,e=0,a=arguments.length;e<a;e++)t+=arguments[e].length;var r=Array(t),n=0;for(e=0;e<a;e++)for(var o=arguments[e],i=0,s=o.length;i<s;i++,n++)r[n]=o[i];return r},s=new Date(2e3,0),d=new Date(2001,3),c=new Date(2e3,3).getTime(),l=new Date(2e3,6).getTime(),m=new Date(2e3,9).getTime(),h=function(){function t(t){var e=this;Object(r.l)(this,t),this.dataStreams=[],this.colorIndex=0,this.colors=["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"],this.increaseColorIndex=function(){e.colorIndex+=1},this.getColor=function(){return e.colors[e.colorIndex%e.colors.length]},this.addStream=function(){var t,a={x:c,y:2.5},r={x:l,y:2.5},s={x:m,y:2.5},d="stream-"+(e.dataStreams.length+1);e.dataStreams=i(e.dataStreams,[{id:d,color:e.getColor(),name:d+"-name",aggregates:(t={},t[o.f]=[a,r,s],t),data:[],resolution:o.f,dataType:n.b.NUMBER}]),e.increaseColorIndex()},this.removeStream=function(){e.dataStreams.pop(),e.dataStreams=i(e.dataStreams),e.colorIndex-=1}}return t.prototype.render=function(){return Object(r.j)("div",{class:"synchro-chart-tests"},Object(r.j)("button",{id:"add-stream",onClick:this.addStream},"Add Stream"),Object(r.j)("button",{id:"remove-stream",onClick:this.removeStream},"Remove Stream"),Object(r.j)("br",null),Object(r.j)("br",null),Object(r.j)("div",{id:"chart-container",style:{marginTop:"20px",width:"500px",height:"500px"}},Object(r.j)("sc-status-timeline",{alarms:{expires:o.f},dataStreams:this.dataStreams,size:{width:500,height:500},widgetId:"widget-id",viewport:{yMin:0,yMax:5e3,start:s,end:d}})),Object(r.j)("sc-webgl-context",null))},t}()}}]);