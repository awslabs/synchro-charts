(window.webpackJsonp=window.webpackJsonp||[]).push([[59],{951:function(t,e,n){"use strict";n.r(e),n.d(e,"status_timeline_threshold_coloration_band",(function(){return g}));var r=n(13),a=n(9),i=n(30),o=(n(101),n(45)),s=n(974),c=new URLSearchParams(window.location.search),u=c.get("isDiscreteNumericData"),d=c.get("isStringData"),l=s.a,w="1"===u?i.b.STRING:i.b.NUMBER;l.y=2e3,"1"===u&&(l.y=2e3),"1"===d&&(l.y="test");var g=function(){function t(t){Object(r.l)(this,t)}return t.prototype.render=function(){var t;return Object(r.j)("div",null,Object(r.j)("sc-status-timeline",{alarms:{expires:o.c},dataStreams:[{id:"test",color:"black",name:"test stream",aggregates:(t={},t[o.c]=[l],t),data:[],resolution:o.c,dataType:w}],annotations:{y:[{value:d?"test":2e3,label:{text:"y label",show:!0},showValue:!0,color:"blue",comparisonOperator:a.a.EQUAL}],thresholdOptions:{showColor:!0}},widgetId:"test-id",size:{width:500,height:500},viewport:{yMin:s.e,yMax:s.f,start:s.b,end:s.g}}),Object(r.j)("sc-webgl-context",null))},t}()},974:function(t,e,n){"use strict";n.d(e,"a",(function(){return u})),n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return c})),n.d(e,"d",(function(){return s})),n.d(e,"e",(function(){return r})),n.d(e,"f",(function(){return a})),n.d(e,"g",(function(){return o})),n(9);var r=0,a=5e3,i=new Date(2e3,0,0,0,0),o=new Date(2e3,0,0,0,10),s=2500,c="Warning",u=(new Date(i.getTime()+1/3*(o.getTime()-i.getTime())),{x:(i.getTime()+o.getTime())/2,y:s})}}]);