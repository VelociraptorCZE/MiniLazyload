/**
 * MiniLazyload
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default class MiniLazyload {
	constructor (options = {}, selector = "[loading=lazy]", override) {
		this.selector = selector;
		this.options = options;
		this.enabled = !HTMLImageElement.prototype.hasOwnProperty("loading") || override;
		this.update();
	}

	update () {
		if (this.enabled) {
			this.loadImages(void 0, false);
		}
	}

	get newObserver () {
		const { threshold, rootMargin } = this.options;
		const observer = new IntersectionObserver(([{ intersectionRatio, target }]) => {
			if (intersectionRatio > 0) {
				observer.unobserve(target);
				this.loadImage(target);
			}
		}, {
			rootMargin: rootMargin || "0px",
			threshold: threshold || .05
		});

		return observer;
	}

	get allElements () {
		return [...document.querySelectorAll(`img${this.selector}, iframe${this.selector}`)];
	}

	loadImage (target) {
		const { src, srcset } = target.dataset;

		if (src) {
			target.src = src;
		}
		if (srcset) {
			target.srcset = srcset;
		}

		this.translateSrcset(target.parentElement);
	}

	loadImages (callback = () => {}, loadImmediately = true) {
		this.allElements.forEach(element => {
			this.onEvents(element);
			callback(element);

			if (!window.IntersectionObserver || loadImmediately) {
				this.loadImage(element);
			}
			else {
				this.newObserver.observe(element);
			}
		});
	}

	translateSrcset (element) {
		if (window.HTMLPictureElement && element instanceof HTMLPictureElement) {
			[...element.querySelectorAll("[data-srcset]")].forEach(source => {
				source.srcset = source.dataset.srcset;
			});
		}
	}

	onEvents (element) {
		const { placeholder } = this.options;
		const loaded = () => element.classList.add("loaded");

		element.addEventListener("error", () => {
			if (placeholder && element.className.indexOf("error") === -1) {
				element.src = placeholder;
			}
			element.classList.add("error");
			element.removeEventListener("load", loaded);
		});

		element.addEventListener("load", loaded);
	}
}