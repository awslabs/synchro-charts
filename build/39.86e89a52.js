(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{1033:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var r={width:100,height:100}},949:function(e,t,n){"use strict";n.r(t),n.d(t,"sc_single_colored_bar",(function(){return l}));var r=n(14),i=(n(8),n(38)),a=(n(138),n(64)),o=(n(69),n(54),n(75),n(139),n(1030),n(1037)),c=(n(1028),n(1034),n(1035),n(1031),n(1039),n(1033)),s=n(1046),d=new Date(2e3,0,0),u=new Date(2e3,0,1),h=u.getTime()-d.getTime(),g={x:new Date(d.getTime()+h/3).getTime(),y:50},l=function(){function e(e){Object(r.l)(this,e)}return e.prototype.componentDidLoad=function(){var e,t=this.el.querySelector("#test-container"),n=Object(s.a)({viewport:{start:d,end:u,yMin:0,yMax:100},dataStreams:[{id:"test-stream",name:"test-stream-name",color:"red",resolution:a.a,data:[],aggregates:(e={},e[a.a]=[g],e),dataType:i.b.NUMBER}],container:t,chartSize:c.a,minBufferSize:100,bufferFactor:2,thresholdOptions:{showColor:!1},thresholds:[]});o.c.addChartScene({manager:n});var r=t.getBoundingClientRect();o.c.setChartRect(n.id,Object.assign({density:1},r.toJSON()))},e.prototype.render=function(){return Object(r.j)("sc-webgl-context",null,Object(r.j)("div",{id:"test-container",style:{width:c.a.width+"px",height:c.a.height+"px"}}))},Object.defineProperty(e.prototype,"el",{get:function(){return Object(r.i)(this)},enumerable:!1,configurable:!0}),e}()}}]);