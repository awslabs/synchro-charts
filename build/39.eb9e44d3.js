(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{892:function(e,t,n){"use strict";n.r(t),n.d(t,"sc_single_colored_bar",(function(){return l}));var r=n(13),i=(n(9),n(30)),a=(n(101),n(45)),o=(n(48),n(42),n(52),n(102),n(975),n(982)),c=(n(973),n(979),n(980),n(976),n(984),n(978)),s=n(991),d=new Date(2e3,0,0),u=new Date(2e3,0,1),h=u.getTime()-d.getTime(),g={x:new Date(d.getTime()+h/3).getTime(),y:50},l=function(){function e(e){Object(r.l)(this,e)}return e.prototype.componentDidLoad=function(){var e,t=this.el.querySelector("#test-container"),n=Object(s.a)({viewport:{start:d,end:u,yMin:0,yMax:100},dataStreams:[{id:"test-stream",name:"test-stream-name",color:"red",resolution:a.a,data:[],aggregates:(e={},e[a.a]=[g],e),dataType:i.b.NUMBER}],container:t,chartSize:c.a,minBufferSize:100,bufferFactor:2,thresholdOptions:{showColor:!1},thresholds:[]});o.c.addChartScene({manager:n});var r=t.getBoundingClientRect();o.c.setChartRect(n.id,Object.assign({density:1},r.toJSON()))},e.prototype.render=function(){return Object(r.j)("sc-webgl-context",null,Object(r.j)("div",{id:"test-container",style:{width:c.a.width+"px",height:c.a.height+"px"}}))},Object.defineProperty(e.prototype,"el",{get:function(){return Object(r.i)(this)},enumerable:!1,configurable:!0}),e}()},978:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var r={width:100,height:100}}}]);