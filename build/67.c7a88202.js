(window.webpackJsonp=window.webpackJsonp||[]).push([[67],{934:function(e,t,n){"use strict";n.r(t),n.d(t,"sc_kpi_standard",(function(){return g}));var a,r=n(13),i=n(39),u=(n(142),n(65)),l=n(77),o=new URLSearchParams(window.location.search),d="true"===o.get("isEnabled"),c=o.get("latestValue"),s=o.get("numCharts");a=null==c||"null"===c||"undefined"===c?null:Object(l.a)(c)?Number.parseInt(c,10):c;var p=s&&Object(l.a)(s)?Number.parseInt(s,10):1,w=new Date(1998,0,0),b=new Date(2e3,0,1),f=new Array(3).fill(null).map((function(e,t){return{x:w.getTime()+u.f*(t+1),y:2===t&&null!=a?a:0+30*(t+1)}})),y="string"==typeof a?i.b.STRING:i.b.NUMBER,m=new Array(p).fill(null).map((function(e,t){return{id:t.toString(),resolution:0,data:0===t?f:[],color:"black",name:"Quality "+(t+1),detailedName:"/BellevueWA/QualitySmogIndex-"+t,unit:"%",dataType:y}})),g=function(){function e(e){Object(r.l)(this,e)}return e.prototype.render=function(){var e=d?{yMin:0,yMax:5e3,duration:u.e}:{start:w,end:b,yMin:0,yMax:5e3};return Object(r.j)("sc-kpi",{widgetId:"test-widget",dataStreams:m,viewport:e})},e}()}}]);