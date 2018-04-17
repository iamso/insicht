/*!
 * insicht - version 0.3.1
 *
 * Made with ❤ by Steve Ottoz so@dev.so
 *
 * Copyright (c) 2018 Steve Ottoz
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

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

      this.options = Object.assign({}, defaults, options);
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
        this.disconnect();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this._items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            /^f/.test(_typeof(this.options.init)) && this.options.init.apply(this, [item, this]);
            this.intersection.observe(item);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

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
          var ratio = Math.min(items[i].intersectionRatio, 1);
          var visible = ratio > 0;

          if (visible && !item.classList.contains(this.options.visibleClass)) {
            stagger = i === 0 ? 0 : stagger + (+item.dataset.stagger || this.options.stagger);
            item.style.transitionDelay = stagger + 'ms';
            item.classList.add(this.options.visibleClass);
            /^f/.test(_typeof(this.options.done)) && this.options.done.apply(this, [item, this]);
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
        mutations = [].slice.call(mutations, 0);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = mutations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var mutation = _step2.value;

            var update = false;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = [].slice.call(mutation.addedNodes, 0)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var item = _step3.value;

                if (item.nodeType === Node.ELEMENT_NODE && (this.matches(item, this.options.selector) || item.querySelectorAll(this.options.selector).length)) {
                  update = true;
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            if (update) {
              this.refresh();
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
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
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this._items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var item = _step4.value;

            item.classList.remove(this.options.visibleClass);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

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