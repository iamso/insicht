/**
 * Default options
 * @type {Object}
 */
const defaults = {
  container: document.documentElement,
  selector: '.insicht',
  visibleClass: 'sichtbar',
  stagger: 100,
  threshold: 0,
  autoRefresh: false,
  autoReset: false,
  autoRemove: false,
  init: () => {},
  done: () => {},
};

/**
 * InSicht class
 */
export default class InSicht {

  /**
   * Create InSicht instance
   * @param  {Object} [options] - options for InSicht
   * @return {Object}           - InSicht instance
   */
  constructor(options = {}) {
    this.options = {
      ...defaults,
      ...options,
    };
    this.init();
  }

  /**
   * Initialize InSicht
   * @return {Object} - InSicht instance
   */
  init() {
    this.intersection = new IntersectionObserver(this.onIntersection.bind(this), {
      threshold: this.options.threshold,
    });
    this.mutation = new MutationObserver(this.onMutation.bind(this));
    this.refreshTimeout = null;
    this._items = [];
    this.connect();
    this.refresh();
    return this;
  }

  /**
   * Refresh the items array
   * @return {Object} - InSicht instance
   */
  refresh() {
    clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(() => {
      this.items = [].slice.call(this.options.container.querySelectorAll(this.options.selector), 0);
    }, 100);
    return this;
  }

  /**
   * Internal item order function
   * @param  {Object} a - item to compare
   * @param  {Object} b - item to compare
   * @return {Number}   - order
   */
  order(a, b) {
    return this._items.indexOf(a.target) - this._items.indexOf(b.target);
  }

  /**
   * Add items to observer
   * @return {Object} - InSicht instance
   */
  connect() {
    this.disconnect();
    for (let item of this._items) {
      /^f/.test(typeof this.options.init) && this.options.init.apply(this, [item, this]);
      this.intersection.observe(item);
    }
    if (this.options.autoRefresh) {
      this.mutation.observe(this.options.container, {
        subtree: true,
        attributes: true,
        childList: true,
      });
    }
    return this;
  }

  /**
   * Disconnect observers
   * @return {Object} - InSicht instance
   */
  disconnect() {
    this.intersection.disconnect();
    this.mutation.disconnect();
    return this;
  }

  /**
   * IntersectionObserver handler function
   * @param  {Object} items - intersecting items
   */
  onIntersection(items) {
    let stagger = 0;
    items = [].slice.call(items, 0);
    items.sort(this.order.bind(this));
    for (let i in items) {
      const item = items[i].target;
      const ratio = Math.min(items[i].intersectionRatio, 1);
      const visible = ratio > 0;

      if (visible && !item.classList.contains(this.options.visibleClass)) {
        stagger = i === 0 ? 0 : stagger + (+item.dataset.stagger || this.options.stagger);
        item.style.transitionDelay = `${stagger}ms`;
        item.classList.add(this.options.visibleClass);
        /^f/.test(typeof this.options.done) && this.options.done.apply(this, [item, this]);
        if (this.options.autoRemove) {
          this.remove(item);
        }
      }
      else if (!visible && this.options.autoReset && item.classList.contains(this.options.visibleClass)) {
        item.style.transitionDelay = '';
        item.classList.remove(this.options.visibleClass);
      }
    }
  }

  /**
   * MutationObserver handler function
   * @param  {Object} mutations - DOM mutations
   */
  onMutation(mutations) {
    mutations = [].slice.call(mutations, 0);
    for (let mutation of mutations) {
      let update = false;
      for (let item of [].slice.call(mutation.addedNodes, 0)) {
        if (item.nodeType === Node.ELEMENT_NODE && (this.matches(item, this.options.selector) || item.querySelectorAll(this.options.selector).length)) {
          update = true;
        }
      }
      if (update) {
        this.refresh();
      }
    }
  }

  /**
   * Internal matches function
   * @param  {HTMLElement} el  - element to check
   * @param  {String} selector - selector to match
   * @return {Boolean}         - matches
   */
  matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  }

  /**
   * Get the items array
   * @return {Array} - the items array
   */
  get items() {
    return this._items;
  }

  /**
   * Set the items array
   * @param  {Array} items - array of items
   */
  set items(items) {
    if (Array.isArray(items)) {
      this._items = items;
      this.connect();
    }
  }

  /**
   * Remove an item from the observer, only if autoRefresh is false
   * @param  {HTMLElement} item - item to be removed
   * @return {Object}           - InSicht instance
   */
  remove(item) {
    if (!this.options.autoRefresh && item && item.nodeType === Node.ELEMENT_NODE) {
      let index = this._items.indexOf(item);
      index > -1 && this._items.splice(index, 1);
      this.intersection.unobserve(item);
    }
    return this;
  }

  /**
   * Reset visible class on items
   * @return {Object} - InSicht instance
   */
  reset() {
    for (let item of this._items) {
      item.classList.remove(this.options.visibleClass);
    }
    return this;
  }

  /**
   * Destroy InSicht
   * @return {Object} - InSicht instance
   */
  destroy() {
    this.disconnect();
    return this;
  }
}
