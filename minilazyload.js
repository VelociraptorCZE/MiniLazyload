/**
 * MiniLazyload
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default class MiniLazyload {
	constructor (options = {}, selector = "[loading=lazy]", override) {
		this.selector = selector;
		this.options = options;
		this.override = override;
		this.update();
	}

	update () {
		if (!HTMLImageElement.prototype.hasOwnProperty("loading") || this.override) {
			if (window.IntersectionObserver) {
				this.runLazyload();
			}
			else {
				this.ignoreLazyload();
			}
		}
	}

	get newObserver () {
		const { threshold, rootMargin } = this.options;
		const observer = new IntersectionObserver(([{ intersectionRatio, target }]) => {
			if (intersectionRatio > 0) {
				observer.unobserve(target);
				const { src, srcset } = target.dataset;
				if (src) {
					target.src = src;
				}
				if (srcset) {
					target.srcset = srcset;
				}
				this.loaded(target);
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

	loaded (element) {
		element.classList.add("loaded");
		this.translateSrcset(element.parentElement);
	}

	ignoreLazyload () {
		this.allElements.forEach(element => {
			this.onError(element);
			this.loaded(element);
			element.src = element.dataset.src;
		});
	}

	translateSrcset (element) {
		const pic = window.HTMLPictureElement;
		if (pic && element instanceof pic) {
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