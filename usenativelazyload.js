/**
 * MiniLazyload
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default function useNativeLazyload (miniLazyload, callback) {
  if (!miniLazyload.enabled) {
    miniLazyload.allElements().forEach(element => {
      if (element.dataset.bg) {
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

  return miniLazyload;
}
