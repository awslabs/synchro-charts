(window.webpackJsonp=window.webpackJsonp||[]).push([[112],{1016:function(t,n,e){"use strict";e.r(n),e.d(n,"stencil_async_content",(function(){return c}));var o=e(13),c=function(){function t(t){Object(o.l)(this,t),this.content=""}return t.prototype.componentWillLoad=function(){if(null!=this.documentLocation)return this.fetchNewContent(this.documentLocation)},t.prototype.fetchNewContent=function(t){var n=this;return fetch(t).then((function(t){return t.text()})).then((function(t){n.content=t}))},t.prototype.render=function(){return Object(o.j)("div",{innerHTML:this.content})},Object.defineProperty(t,"watchers",{get:function(){return{documentLocation:["fetchNewContent"]}},enumerable:!1,configurable:!0}),t}()}}]);