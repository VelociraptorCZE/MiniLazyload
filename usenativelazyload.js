/**
 * MiniLazyload
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default function useNativeLazyload (miniLazyload, callback) {
    if (!miniLazyload.enabled) {
        miniLazyload.loadImages(function (image) {
            image.loading = "lazy";
            callback && callback(image);
        });
    }

    return miniLazyload;
}