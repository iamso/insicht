/*!
 * insicht - version 0.7.0
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2020 Steve Ottoz
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.InSicht = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  /**
   * Default options
   * @type {Object}
   */
  var defaults = {
    container: document.documentElement,
    selector: '.insicht',
    visibleClass: 'sichtbar',
    stagger: 100,
    threshold: 0,
    autoRefresh: false,
    autoReset: false,
    autoRemove: false,
    init: function init() {},
    done: function done() {}
  };

  /**
   * InSicht class
   */

  var InSicht = function () {

    /**
     * Create InSicht instance
     * @param  {Object} [options] - options for InSicht
     * @return {Object}           - InSicht instance
     */
    function InSicht() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, InSicht);

      this.options = _extends({}, defaults, options);
      this.init();
    }

    /**
     * Initialize InSicht
     * @return {Object} - InSicht instance
     */


    _createClass(InSicht, [{
      key: 'init',
      value: function init() {
        this.intersection = new IntersectionObserver(this.onIntersection.bind(this), {
          threshold: this.options.threshold
        });
        this.mutation = new MutationObserver(this.onMutation.bind(this));
        this.refreshTimeout = null;
        this._items = [];
        this.connect();
        this.refresh();
        return this;
      }
    }, {
      key: 'refresh',
      value: function refresh() {
        var _this = this;

        clearTimeout(this.refreshTimeout);
        this.refreshTimeout = setTimeout(function () {
          _this.items = [].slice.call(_this.options.container.querySelectorAll(_this.options.selector), 0);
        }, 100);
        return this;
      }
    }, {
      key: 'order',
      value: function order(a, b) {
        return this._items.indexOf(a.target) - this._items.indexOf(b.target);
      }
    }, {
      key: 'connect',
      value: function connect() {
        var _this2 = this;

        this.disconnect();
        this._items.forEach(function (item) {
          _this2.options.init instanceof Function && _this2.options.init.apply(_this2, [item, _this2]);
          _this2.intersection.observe(item);
        });
        if (this.options.autoRefresh) {
          this.mutation.observe(this.options.container, {
            subtree: true,
            attributes: true,
            childList: true
          });
        }
        return this;
      }
    }, {
      key: 'disconnect',
      value: function disconnect() {
        this.intersection.disconnect();
        this.mutation.disconnect();
        return this;
      }
    }, {
      key: 'onIntersection',
      value: function onIntersection(items) {
        var stagger = 0;
        items = [].slice.call(items, 0);
        items.sort(this.order.bind(this));
        for (var i in items) {
          var item = items[i].target;
          var visible = items[i].isIntersecting;

          if (visible && !item.classList.contains(this.options.visibleClass)) {
            stagger = i === 0 ? 0 : stagger + (+item.dataset.stagger || this.options.stagger);
            item.style.transitionDelay = stagger + 'ms';
            item.classList.add(this.options.visibleClass);
            this.options.done instanceof Function && this.options.done.apply(this, [item, this]);
            if (this.options.autoRemove) {
              this.remove(item);
            }
          } else if (!visible && this.options.autoReset && item.classList.contains(this.options.visibleClass)) {
            item.style.transitionDelay = '';
            item.classList.remove(this.options.visibleClass);
          }
        }
      }
    }, {
      key: 'onMutation',
      value: function onMutation(mutations) {
        var _this3 = this;

        mutations = [].slice.call(mutations, 0);
        mutations.forEach(function (mutation) {
          var update = false;
          [].slice.call(mutation.addedNodes, 0).forEach(function (item) {
            if (item.nodeType === Node.ELEMENT_NODE && (_this3.matches(item, _this3.options.selector) || item.querySelectorAll(_this3.options.selector).length)) {
              update = true;
            }
          });

          if (update) {
            _this3.refresh();
          }
        });
      }
    }, {
      key: 'matches',
      value: function matches(el, selector) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
      }
    }, {
      key: 'remove',
      value: function remove(item) {
        if (!this.options.autoRefresh && item && item.nodeType === Node.ELEMENT_NODE) {
          var index = this._items.indexOf(item);
          index > -1 && this._items.splice(index, 1);
          this.intersection.unobserve(item);
        }
        return this;
      }
    }, {
      key: 'reset',
      value: function reset() {
        var _this4 = this;

        this._items.forEach(function (item) {
          item.classList.remove(_this4.options.visibleClass);
        });
        return this;
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.disconnect();
        return this;
      }
    }, {
      key: 'items',
      get: function get() {
        return this._items;
      },
      set: function set(items) {
        if (Array.isArray(items)) {
          this._items = items;
          this.connect();
        }
      }
    }]);

    return InSicht;
  }();

  exports.default = InSicht;
  module.exports = exports['default'];
});