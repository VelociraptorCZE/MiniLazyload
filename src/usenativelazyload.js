/**
 * MiniLazyload
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default function useNativeLazyload (miniLazyload, callback) {
  miniLazyload.allElements().forEach(element => {
    if (element.dataset.bg || element.dataset.lazyClass) {
      miniLazyload.newObserver().observe(element);
    }
  });

  miniLazyload.loadImages(image => {
    image.loading = "lazy";
    if (callback) {
      callback(image);
    }
  });
}
