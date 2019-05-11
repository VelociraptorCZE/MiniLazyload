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
			if (window.IntersectionObserver) {
				this.runLazyload();
			}
			else {
				this.loadImages();
			}
		}
	}

	get newObserver () {
		const { threshold, rootMargin } = this.options;
		const observer = new IntersectionObserver(([{ intersectionRatio, target }]) => {
			if (intersectionRatio > 0) {
				observer.unobserve(target);
				this.load(target);
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

	load (target) {
		const { src, srcset } = target.dataset;

		if (src) {
			target.src = src;
		}
		if (srcset) {
			target.srcset = srcset;
		}

		target.classList.add("loaded");
		this.translateSrcset(target.parentElement);
	}

	loadImages () {
		this.allElements.forEach(element => {
			this.onError(element);
			this.load(element);
		});
	}

	translateSrcset (element) {
		if (window.HTMLPictureElement && element instanceof HTMLPictureElement) {
			[...element.querySelectorAll("[data-srcset]")].forEach(source => {
				source.srcset = source.dataset.srcset;
			});
		}
	}

	runLazyload () {
		this.allElements.forEach(element => {
			this.newObserver.observe(element);
			this.onError(element);
		});
	}

	onError (element) {
		const { placeholder } = this.options;

		element.addEventListener("error", () => {
			if (placeholder && element.className.indexOf("error") === -1) {
				element.src = placeholder;
			}

			element.classList.add("error");
			element.classList.remove("loaded");
		});
	}
}