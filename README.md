# MiniLazyload

Using this library is actually easy and straightforward. Start with importing this library to your script:

```js
import MiniLazyload from "minilazyload/minilazyload";
```

Then just simply call the constructor of the MiniLazyload class:

```js
new MiniLazyload();
```

By default this library selects elements with attribute loading which equals to "lazy" also please be aware that 
library selects only images and iframes, so default selector looks like:

```js
"img[loading=lazy], iframe[loading=lazy]"
```

You can change these default settings, for example, if you want to select iframes and images by class ".lazyload" 
then just add the parameter to the constructor call:

```js
new MiniLazyload({}, ".lazyload"); // "img.lazyload, iframe.lazyload"
```

You might ask why there is the first parameter filled with an empty object. 
The reason is that in the first parameter you pass an object with options which modifies the lazyload behavior, 
so even in the case, you want to change only the default selector you still need to pass two parameters anyway.

## Options

At this point it should be all flawless, right? Now we can jump into mentioned options
you can set placeholder, threshold, and rootMargin.
How does each option work? 

Placeholder option sets the placeholder image when the Error event is called
so for example when the path to the image is wrong and the placeholder is defined library will load the placeholder instead.

The threshold could be useful when you have specified some exact height for your element and you want to load an image when some part of that element is visible in the current viewport,
then for example when half of the element is visible in this case you can set the threshold to .5 to make this work. 

The last parameter is rootMargin and by default is set the margin to 0 so the image will be loaded immediately when you scroll on it.
Sometimes you need to load images before and just for this purpose, you can use this parameter.
For example "500px 0px 500px 0px" will load an image when the element is near viewport ±500px from top or bottom. 

These options are of course completely optional and can be omitted.

```js
new MiniLazyload({
    placeholder: "https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image",
    threshold: .1,
    rootMargin: "500px 0px 500px 0px"
}, ".lazyload");
```

### HTML
Both **src** and **srcset** attributes are supported, although srcset is supported not only with images,
but also on descendants of picture element which has **data-srcset** attribute.
You need to add to your elements data attribute either **data-src** or **data-srcset**.

```html
<picture>
    <source media="(min-width: 540px)" data-srcset="https://something.domain/some-image.jpg">
    <img data-src="https://something.domain/some-image2.jpg" alt="" class="lazyload">
</picture>
```

When **img** is in the viewport, library will add **src** attribute, 
also alongside with adding src attribute if the parent element is the **picture** element then 
library finds elements within this element with **data-srcset** attribute
and assigns **srcset** attribute for respective elements.

Other examples:

```html
<img data-srcset="https://something.domain/some-image.jpg 540w,
                  https://something.domain/some-image2.jpg 768w" alt="" class="lazyload"
```

```html
<img data-src="https://something.domain/some-image.jpg" alt="" class="lazyload">
```
