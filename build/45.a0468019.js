(window.webpackJsonp=window.webpackJsonp||[]).push([[45],{1036:function(t,e,n){"use strict";n.d(e,"a",(function(){return s})),n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return d})),n.d(e,"d",(function(){return c})),n.d(e,"e",(function(){return r})),n.d(e,"f",(function(){return a})),n.d(e,"g",(function(){return o})),n(8);var r=0,a=5e3,i=new Date(2e3,0,0,0,0),o=new Date(2e3,0,0,0,10),c=2500,d="Warning",s=(new Date(i.getTime()+1/3*(o.getTime()-i.getTime())),{x:(i.getTime()+o.getTime())/2,y:c})},968:function(t,e,n){"use strict";n.r(e),n.d(e,"sc_webgl_bar_chart_dynamic_data_streams",(function(){return h}));var r=n(14),a=(n(8),n(39)),i=(n(141),n(65)),o=n(1036),c=function(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;var r=Array(t),a=0;for(e=0;e<n;e++)for(var i=arguments[e],o=0,c=i.length;o<c;o++,a++)r[a]=i[o];return r},d=new Date(2e3,0),s=new Date(2001,3),u=new Date(2e3,3).getTime(),m=new Date(2e3,6).getTime(),l=new Date(2e3,9).getTime(),h=function(){function t(t){var e=this;Object(r.l)(this,t),this.dataStreams=[],this.colorIndex=0,this.colors=["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"],this.increaseColorIndex=function(){e.colorIndex+=1},this.getColor=function(){return e.colors[e.colorIndex%e.colors.length]},this.addStream=function(){var t,n={x:u,y:o.d},r={x:m,y:o.d},d={x:l,y:o.d},s="stream-"+(e.dataStreams.length+1);e.dataStreams=c(e.dataStreams,[{id:s,color:e.getColor(),name:s+"-name",aggregates:(t={},t[i.f]=[n,r,d],t),data:[],resolution:i.f,dataType:a.b.NUMBER}]),e.increaseColorIndex()},this.removeStream=function(){e.dataStreams.pop(),e.dataStreams=c(e.dataStreams),e.colorIndex-=1}}return t.prototype.render=function(){return Object(r.j)("div",{class:"synchro-chart-tests"},Object(r.j)("button",{id:"add-stream",onClick:this.addStream},"Add Stream"),Object(r.j)("button",{id:"remove-stream",onClick:this.removeStream},"Remove Stream"),Object(r.j)("br",null),Object(r.j)("br",null),Object(r.j)("div",{id:"chart-container",style:{marginTop:"20px",width:"500px",height:"500px"}},Object(r.j)("sc-bar-chart",{dataStreams:this.dataStreams,size:{width:500,height:500},widgetId:"widget-id",viewport:{yMin:0,yMax:5e3,start:d,end:s}})),Object(r.j)("sc-webgl-context",null))},t}()}}]);