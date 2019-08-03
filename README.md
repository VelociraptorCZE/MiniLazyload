# MiniLazyload
A tiny library for image and iframe lazyloading.

### Installation

```
npm install minilazyload
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

Placeholder is the only parameter what doesn't work with IntersectionObserver whatsoever. When the error event occurs
on your image and placeholder is defined, then library will change **src** in your image to your placeholder src
in order to load a placeholder image.

```js
new MiniLazyload({
    rootMargin: "500px",
    threshold: .5,
    placeholder: "https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image"
});
```

### Selector

By default this library selects elements with attribute loading which equals to "lazy" also please be aware 
library selects only images and iframes. Default selector looks equals to:

```js
"img[loading=lazy], iframe[loading=lazy]"
```

You can change those default settings, just pass your own selector instead.

```js
new MiniLazyload({
    rootMargin: "500px",
    threshold: .5,
    placeholder: "https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image"
}, ".lazyload"); // img.lazyload, iframe.lazyload
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

## HTML
Both **src** and **srcset** attributes are supported and srcset is supported with images,
but also with descendants of picture element which has **data-srcset** attribute.
You need to add to your elements data attribute either **data-src** or **data-srcset**.

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
