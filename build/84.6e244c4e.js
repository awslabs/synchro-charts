(window.webpackJsonp=window.webpackJsonp||[]).push([[84],{969:function(e,t,a){"use strict";a.r(t),a.d(t,"sc_webgl_bar_chart_margin",(function(){return u}));var n,r,i=a(13),o=a(39),c=(a(142),a(65)),s=new Date(1998,1,0),d=new Date(1998,6,0),g={id:"test",color:"red",name:"test stream",resolution:c.f,aggregates:(n={},n[c.f]=[{x:new Date(1998,3,0,0).getTime(),y:1e3},{x:new Date(1998,4,0,0).getTime(),y:3e3}],n),data:[],dataType:o.b.NUMBER},w={id:"test2",color:"orange",name:"test stream2",resolution:c.f,aggregates:(r={},r[c.f]=[{x:new Date(1998,3,0,0).getTime(),y:2e3},{x:new Date(1998,4,0,0).getTime(),y:4e3}],r),data:[],dataType:o.b.NUMBER},u=function(){function e(e){Object(i.l)(this,e),this.data=[]}return e.prototype.render=function(){return Object(i.j)("div",{id:"chart-container",style:{height:"500px",width:"500px",marginTop:"20px"}},Object(i.j)("sc-bar-chart",{widgetId:"widget-id",dataStreams:[g,w],viewport:{yMin:0,yMax:5e3,start:s,end:d},bufferFactor:1,minBufferSize:1}),Object(i.j)("sc-webgl-context",null))},e}()}}]);