(window.webpackJsonp=window.webpackJsonp||[]).push([[87],{1010:function(e,t,a){"use strict";a.r(t),a.d(t,"status_timeline_fast_viewport",(function(){return l}));var n=a(14),r=a(39),i=(a(141),a(65)),s=a(1035),o=new Date(1999,9,0,0,0),d=new Date(2e3,2,0,0,10),u=Array.from({length:50},(function(e,t){return{x:new Date(2e3,0,t,0,0).getTime(),y:2500}})),l=function(){function e(e){var t=this;Object(n.l)(this,e),this.dataStreams=[],this.colorIndex=0,this.start=o,this.end=d,this.idx=0,this.timeRange=[[new Date(2e3,2,0,0,0),new Date(2e3,3,0,0,0)],[new Date(2010,4,0,0,0),new Date(2020,5,0,0,0)],[new Date(2030,6,0,0,0),new Date(2040,7,0,0,0)],[o,d]],this.changeViewport=function(){var e=t.timeRange[t.idx%t.timeRange.length],a=e[0],n=e[1];t.start=a,t.end=n,t.idx+=1}}return e.prototype.render=function(){var e;return Object(n.j)("div",{class:"synchro-chart-tests"},Object(n.j)("button",{id:"change-viewport",onClick:this.changeViewport},"Change Viewport"),Object(n.j)("br",null),Object(n.j)("br",null),Object(n.j)("div",{id:"chart-container",style:{border:"1px solid lightgray",height:"500px",width:"500px"}},Object(n.j)("sc-status-timeline",{alarms:{expires:i.b},dataStreams:[{id:"test",color:"#264653",name:"test stream",aggregationType:s.a.AVERAGE,aggregates:(e={},e[i.b]=u,e),data:[],resolution:i.b,dataType:r.b.NUMBER}],widgetId:"widget-id",size:{height:500,width:500},viewport:{yMin:0,yMax:5e3,start:this.start,end:this.end}}),Object(n.j)("sc-webgl-context",null)))},e}()},1035:function(e,t,a){"use strict";a.d(t,"a",(function(){return d})),a.d(t,"b",(function(){return n})),a.d(t,"c",(function(){return r})),a.d(t,"d",(function(){return o})),a.d(t,"e",(function(){return i})),a.d(t,"f",(function(){return s}));var n={liveTimeFrameValueLabel:"Value",historicalTimeFrameValueLabel:"Value",noDataStreamsPresentHeader:"No properties or alarms",noDataStreamsPresentSubHeader:"This widget doesn't have any properties or alarms.",noDataPresentHeader:"No data",noDataPresentSubHeader:"There's no data to display for this time range.",liveModeOnly:"This visualization displays only live data. Choose a live time frame to display data in this visualization.",unsupportedDataTypeHeader:"Unable to render your data",unsupportedDataTypeSubHeader:"This chart only supports the following DataType(s):",supportedTypes:"Number, String, Boolean"},r="round",i=3,s="M 2 2 H 15",o="1, 5",d={AVERAGE:"AVERAGE",COUNT:"COUNT",MAXIMUM:"MAXIMUM",MINIMUM:"MINIMUM",STANDARD_DEVIATION:"STANDARD_DEVIATION",SUM:"SUM"}}}]);