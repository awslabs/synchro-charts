(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{1040:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var r={width:100,height:100}},923:function(e,t,n){"use strict";n.r(t),n.d(t,"multiple_statuses",(function(){return p}));var r=n(14),a=(n(8),n(39)),i=(n(141),n(65)),o=(n(70),n(55),n(77),n(142),n(1037),n(1044)),s=n(1052),c=(n(1035),n(1041),n(1042),n(1038),n(1046),n(1040)),d=new Date(2e3,0,0),u=new Date(2e3,0,1),l=u.getTime()-d.getTime(),b={x:d.getTime()+l/3,y:25},h={x:d.getTime()+l*(2/3),y:50},p=function(){function e(e){Object(r.l)(this,e)}return e.prototype.componentDidLoad=function(){var e,t,n=this.el.querySelector("#test-container"),r=Object(s.c)({alarms:{expires:5*i.b},viewport:{start:d,end:u,yMin:0,yMax:s.a},dataStreams:[{id:"test-stream",aggregates:(e={},e[5*i.b]=[b],e),data:[],resolution:5*i.b,name:"test-stream-name",color:"black",dataType:a.b.NUMBER},{id:"test-stream-2",aggregates:(t={},t[5*i.b]=[h],t),data:[],name:"test-stream-name-2",color:"red",resolution:5*i.b,dataType:a.b.NUMBER}],container:n,chartSize:c.a,minBufferSize:100,bufferFactor:2,thresholdOptions:{showColor:!1},thresholds:[]});o.c.addChartScene({manager:r});var l=n.getBoundingClientRect();o.c.setChartRect(r.id,Object.assign({density:1},l.toJSON()))},e.prototype.render=function(){return Object(r.j)("sc-webgl-context",null,Object(r.j)("div",{id:"test-container",style:{width:c.a.width+"px",height:c.a.height+"px"}}))},Object.defineProperty(e.prototype,"el",{get:function(){return Object(r.i)(this)},enumerable:!1,configurable:!0}),e}()}}]);