InSicht
=======
Viewport animation using IntersectionObserver.

Make sure to add a [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) if needed. Check [caniuse](http://caniuse.com/#feat=intersectionobserver) for more info on support.

Install
-------

```bash
npm install insicht
```

Example Setup
-------------

### Javascript

```javascript
import InSicht from 'insicht';

// create an instance with default options
const insicht = new InSicht({
  container: document.documentElement,
  selector: '.insicht',
  visibleClass: 'sichtbar',
  stagger: 100,
  threshold: 0,
  useAnimationDelay: false,
  autoRefresh: false,
  autoReset: false,
  autoRemove: false,
  init: (item, instance) => {},
  done: (item, instance) => {},
});
```

There are 2 callback functions, `init` and `done`. `init` is run when an item is added and `done` is run when an item enters the viewport. They both receive 2 arguments, the item and the InSicht instance.

#### Functions

If you don't have autoRefresh enabled, you can manually refresh the items array, might be useful for ajax websites:

```javascript
insicht.refresh();
```

Or you can reset the classes on all items:

```javascript
insicht.reset();
```

If you don't need it anymore, you can dispose of it properly:

```javascript
insicht.destroy();
delete insicht;
```

### CSS

You can overwrite the class that InSicht adds to visible elements, but using the default, it could look something like this:

```css
.selector {
  opacity: 0;
  transition: 0.3s ease-out;
}
.selector.sichtbar {
  opacity: 1;
}
```

### HTML

You can add custom values for staggering individual elements:

```html
<div class="insicht" data-stagger="200"></div>
```

License
-------

[MIT License](LICENSE)
