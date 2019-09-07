# MiniLazyload [![](https://data.jsdelivr.com/v1/package/npm/minilazyload/badge?style=rounded)](https://www.jsdelivr.com/package/npm/minilazyload) ![npm](https://img.shields.io/npm/dm/minilazyload) ![](https://img.badgesize.io/velociraptorcze/minilazyload/master/dist/minilazyload.min.js.svg?compression=gzip)

A tiny library for image, iframe and background lazyloading.

### Features

- small size (under 1kB gzipped)
- support for responsive images and placeholders
- convenient usage of native lazyload with library support

### HTML import

If you want to directly import minified script to your HTML, you can do that with this piece of code:

```html
<script src="https://cdn.jsdelivr.net/npm/minilazyload@2.1.5/dist/minilazyload.min.js"></script>
```

### Installation

```
npm i minilazyload --save
```

### Launchpad

Using this library is actually easy and straightforward. Start with importing this library to your script:

```js
import MiniLazyload from "minilazyload";
```

Then just simply instantiate MiniLazyload:

```js
new MiniLazyload();
```

## Constructor parameters

Constructor takes three parameters and all of them could be omitted.

- options
- selector
- override

### Options

In first parameter you can define object with some properties which then will be used for IntersectionObserver.

- rootMargin
- threshold
- placeholder
- onload

#### rootMargin

Root margin is useful when you want load images within some "buffer zone". This means, if you set rootMargin to 500px
then images in the current viewport and also images up to 500px from each side will be loaded. 
Since the value of this parameter is directly passed to IntersectionObserver you can use either px or %.

```js
new MiniLazyload({
    rootMargin: "500px"
});
```

#### threshold

If you want to load image when the certain part of image is in the current viewport then you can use threshold.
For example when image has to be loaded if the half of the image is visible in the viewport:

```js
new MiniLazyload({
    rootMargin: "500px",
    threshold: .5
});
```

#### placeholder

Placeholder is one out of two parameters what doesn't work with IntersectionObserver whatsoever. When the error event occurs
on your image and placeholder is defined, then library will change **src** in your image to your placeholder src
in order to load a placeholder image.

```js
new MiniLazyload({
    rootMargin: "500px",
    threshold: .5,
    placeholder: "https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image"
});
```

#### onload

To onload you can pass your own callback which then will be called 
on each image when it's actually loaded.

```js
new MiniLazyload({
    rootMargin: "500px",
    threshold: .5,
    placeholder: "https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image"
    onload: image => image.style.border = "10px dashed #000"
});
```

### Selector

By default this library selects elements with attribute loading which equals to "lazy". 
___
##### Before version 2.0.0
Please be aware library selects only images and iframes.

Default selector equals to:

```js
"img[loading=lazy], iframe[loading=lazy]"
```

##### From version 2.0.0 onwards

Library selects no longer only images and iframes.
I've made decision to make this library more flexible.

Default selector:

```js
"[loading=lazy]"
```
___

You can change this default selector, just pass your own selector instead as a second parameter.

```js
new MiniLazyload({
    rootMargin: "500px",
    threshold: .5,
    placeholder: "https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image"
}, ".lazyload"); 

// <= 1.0.8: img.lazyload, iframe.lazyload
// >= 2.0.0: .lazyload
```

### Override

This is third and final parameter. MiniLazyload isn't executed in browsers which supports native lazyload by default,
since Chrome is already shipped with this feature. You have two possible options to deal with this behavior with two different outcomes.

If you omit this parameter then you should implement
action to browsers with native lazyload, thankfully, this is fairly easy with this library.

#### First option

If you set override to *true*, then library will ignore native lazyload and MiniLazyload will be executed, or you can use
**MiniLazyload.IGNORE_NATIVE_LAZYLOAD** flag for better readability. 

```js
new MiniLazyload({
    rootMargin: "500px",
    threshold: .5,
    placeholder: "https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image"
}, ".lazyload", MiniLazyload.IGNORE_NATIVE_LAZYLOAD); // Easiest option
```

#### Second and preferable option

```js
const lazyload = new MiniLazyload({
    rootMargin: "500px",
    threshold: .5,
    placeholder: "https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image"
}, ".lazyload");

if (!lazyload.enabled) {
    lazyload.loadImages(image => {
       image.loading = "lazy";
    });
}
```

Every instance of MiniLazyload has property **enabled**, this property equals to *true* when override isn't set
and browser doesn't have the native lazyload. So when **enabled** equals to false we need to handle this.

You can use **loadImages** method, although this method is used internally you can use it to your advantage. It's
also possible to pass a callback along with this method and you can set some important properties for each image in that callback.
Bare minimum is to set attribute loading to *"lazy"* if isn't set previously and the library will do rest for you.

#### useNativeLazyload wrapper

Since version 2.1.0 you can instead of making this fallback for browsers with native lazyload use this function.

Function takes two parameters, first is instance of MiniLazyload and second is optional callback.
Returns your instance of MiniLazyload.

##### Module import

```js
import useNativeLazyload from "minilazyload/usenativelazyload";
```

##### HTML import

```html
<script src="https://cdn.jsdelivr.net/npm/minilazyload@2.1.5/dist/usenativelazyload.min.js"></script>
```

##### Example

```js
const lazyload = useNativeLazyload(new MiniLazyload({
    rootMargin: "500px",
    threshold: .5,
    placeholder: "https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image"
}, ".lazyload"));
```

## HTML
Both **src** and **srcset** attributes are supported and srcset is supported with images,
but also with descendants of picture element which has **data-srcset** attribute.
You need to add to your elements data attribute either **data-src** or **data-srcset**.
For background lazyloading use **data-bg** attribute.

```html
<picture>
    <source media="(min-width: 540px)" data-srcset="https://something.domain/some-image.jpg">
    <img data-src="https://something.domain/some-image2.jpg" alt="" class="lazyload">
</picture>
```

```html
<img data-srcset="https://something.domain/some-image.jpg 540w,
                  https://something.domain/some-image2.jpg 768w" alt="" class="lazyload"
```

```html
<img data-src="https://something.domain/some-image.jpg" alt="" class="lazyload">
```

```html
<div data-bg="https://something.domain/some-image.jpg" class="lazyload"></div>
```
