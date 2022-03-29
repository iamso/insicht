/*!
 * insicht - version 0.10.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2022 Steve Ottoz
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Insicht=e()}(this,(function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function i(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function n(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function s(t){for(var e=1;e<arguments.length;e++){var s=null!=arguments[e]?arguments[e]:{};e%2?n(Object(s),!0).forEach((function(e){i(t,e,s[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):n(Object(s)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(s,e))}))}return t}var o={container:document.documentElement,selector:".insicht",visibleClass:"sichtbar",stagger:100,threshold:0,useAnimationDelay:!1,autoRefresh:!1,autoReset:!1,autoRemove:!1,init:function(){},done:function(){}};return function(){function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t(this,i),this.options=s(s({},o),e),this.init()}var n,r,c;return n=i,(r=[{key:"init",value:function(){return this.intersection=new IntersectionObserver(this.onIntersection.bind(this),{threshold:this.options.threshold}),this.mutation=new MutationObserver(this.onMutation.bind(this)),this.refreshTimeout=null,this._items=[],this.connect(),this.refresh(),this}},{key:"refresh",value:function(){var t=this;return clearTimeout(this.refreshTimeout),this.refreshTimeout=setTimeout((function(){t.items=[].slice.call(t.options.container.querySelectorAll(t.options.selector),0)}),100),this}},{key:"order",value:function(t,e){return this._items.indexOf(t.target)-this._items.indexOf(e.target)}},{key:"connect",value:function(){var t=this;return this.disconnect(),this._items.forEach((function(e){t.options.init instanceof Function&&t.options.init.apply(t,[e,t]),t.intersection.observe(e)})),this.options.autoRefresh&&this.mutation.observe(this.options.container,{subtree:!0,attributes:!0,childList:!0}),this}},{key:"disconnect",value:function(){return this.intersection.disconnect(),this.mutation.disconnect(),this}},{key:"onIntersection",value:function(t){var e=0;for(var i in(t=[].slice.call(t,0)).sort(this.order.bind(this)),t){var n=t[i].target,s=t[i].isIntersecting;s&&!n.classList.contains(this.options.visibleClass)?(e=0===i?0:e+(+n.dataset.stagger||this.options.stagger),this.options.useAnimationDelay?n.style.animationDelay="".concat(e,"ms"):n.style.transitionDelay="".concat(e,"ms"),n.classList.add(this.options.visibleClass),this.options.done instanceof Function&&this.options.done.apply(this,[n,this]),this.options.autoRemove&&this.remove(n)):!s&&this.options.autoReset&&n.classList.contains(this.options.visibleClass)&&(this.options.useAnimationDelay?n.style.animationDelay="":n.style.transitionDelay="",n.classList.remove(this.options.visibleClass))}}},{key:"onMutation",value:function(t){var e=this;(t=[].slice.call(t,0)).forEach((function(t){var i=!1;[].slice.call(t.addedNodes,0).forEach((function(t){t.nodeType===Node.ELEMENT_NODE&&(e.matches(t,e.options.selector)||t.querySelectorAll(e.options.selector).length)&&(i=!0)})),i&&e.refresh()}))}},{key:"matches",value:function(t,e){return(t.matches||t.matchesSelector||t.msMatchesSelector||t.mozMatchesSelector||t.webkitMatchesSelector||t.oMatchesSelector).call(t,e)}},{key:"remove",value:function(t){if(!this.options.autoRefresh&&t&&t.nodeType===Node.ELEMENT_NODE){var e=this._items.indexOf(t);e>-1&&this._items.splice(e,1),this.intersection.unobserve(t)}return this}},{key:"reset",value:function(){var t=this;return this._items.forEach((function(e){e.classList.remove(t.options.visibleClass)})),this}},{key:"destroy",value:function(){return this.disconnect(),this}},{key:"items",get:function(){return this._items},set:function(t){Array.isArray(t)&&(this._items=t,this.connect())}}])&&e(n.prototype,r),c&&e(n,c),i}()}));
