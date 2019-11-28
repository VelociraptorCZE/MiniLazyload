/**
 * MiniLazyload
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

import useNativeLazyload from "./usenativelazyload";

export default function MiniLazyload (options = {}, selector, override) {
  this.update = () => {
    if (this.enabled) {
      this.loadImages(() => {}, false);
    } else {
      useNativeLazyload(this);
    }
  };

  this.allElements = () => [].slice.call(document.querySelectorAll(this.selector));

  this.loadImages = (callback = () => {}, loadImmediately = true) => {
    this.allElements().forEach(element => {
      onEvents(element);
      callback(element);

      if (!window.IntersectionObserver || loadImmediately) {
        loadImage(element);
      } else {
        this.newObserver().observe(element);
      }
    });
  };

  this.newObserver = () =>
    new IntersectionObserver((entries, observer) => {
      entries.forEach(({ intersectionRatio, target }) => {
        if (intersectionRatio > 0) {
          observer.unobserve(target);
          loadImage(target, true);
        }
      });
    }, this.options);

  const loadImage = (target, loadSpecialAttrs) => {
    const { src, srcset, bg, lazyClass } = target.dataset;
    loadSpecialAttrs = loadSpecialAttrs || !window.IntersectionObserver;

    if (src) {
      target.src = src;
    }

    if (srcset) {
      target.srcset = srcset;
    }

    if (loadSpecialAttrs && bg) {
      target.style.backgroundImage = `url("${bg}")`;
    }

    if (loadSpecialAttrs && lazyClass) {
      target.classList.add(lazyClass);
    }

    translateSrcset(target.parentElement);
  };

  const translateSrcset = element => {
    if (window.HTMLPictureElement && element instanceof HTMLPictureElement) {
      [].slice.call(element.querySelectorAll("[data-srcset]")).forEach(source => {
        source.srcset = source.dataset.srcset;
      });
    }
  };

  const onEvents = element => {
    const { placeholder, onload = () => {} } = this.options;
    const loaded = () => {
      onload(element);
      element.classList.add("loaded");
    };

    element.addEventListener("error", () => {
      if (placeholder && !element.classList.contains("error")) {
        element.src = placeholder;
      }
      element.classList.add("error");
      element.removeEventListener("load", loaded);
    });

    element.addEventListener("load", loaded);
  };

  this.selector = selector || "[loading=lazy]";
  this.options = options;
  this.enabled =
    !HTMLImageElement.prototype.hasOwnProperty("loading") || override === MiniLazyload.IGNORE_NATIVE_LAZYLOAD;
  this.update();
}

MiniLazyload.IGNORE_NATIVE_LAZYLOAD = true;
