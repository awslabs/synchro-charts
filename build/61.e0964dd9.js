(window.webpackJsonp=window.webpackJsonp||[]).push([[61],{913:function(t,e,i){"use strict";i.r(e),i.d(e,"line_chart_viewport_change",(function(){return p}));var n=i(13),r="some-group",o={start:new Date(2e3,0,0),end:new Date(2e3,0,1),group:r},u={start:new Date(2e3,0,0),end:new Date(2001,0,0),group:r},c={duration:"5m"},w={duration:"30m"},p=function(){function t(t){var e=this;Object(n.l)(this,t),this.viewport=o,this.setViewPort=function(t){e.viewport=t}}return t.prototype.render=function(){var t=this;return Object(n.j)("div",{style:{fontSize:"10px"}},Object(n.j)("button",{id:"toggle-narrow-view-port",onClick:function(){return t.setViewPort(o)}},"use narrow viewport"),Object(n.j)("button",{id:"toggle-wide-view-port",onClick:function(){return t.setViewPort(u)}},"use wide viewport"),Object(n.j)("button",{id:"toggle-five-minute-view-port",onClick:function(){return t.setViewPort(c)}},"use 5 minute viewport"),Object(n.j)("button",{id:"toggle-thirty-moinute-view-port",onClick:function(){return t.setViewPort(w)}},"use 30 minute viewport"),Object(n.j)("br",null),Object(n.j)("br",null),Object(n.j)("div",{id:"chart-container",style:{marginTop:"20px",width:"500px",height:"500px"}},Object(n.j)("sc-line-chart",{widgetId:"widget-id",dataStreams:[],viewport:this.viewport})),Object(n.j)("sc-webgl-context",null))},t}()}}]);