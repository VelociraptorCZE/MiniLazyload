/**
 * MiniLazyload
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default class MiniLazyload {
	constructor (options = {}, selector = "[loading=lazy]", overrideNativeLazyload) {
		this.selector = selector;
		this.options = options;

		if (!("loading" in HTMLImageElement.prototype) || overrideNativeLazyload) {
			this.update();
		}
	}

	update () {
		if (window.IntersectionObserver) {
			this.runLazyload();
		}
		else {
			this.ignoreLazyload();
		}
	}

	createObserver () {
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
				target.classList.add("loaded");
				this.translateSrcset(target.parentElement);
			}
		}, {
			rootMargin: rootMargin || "0px",
			threshold: threshold || .05
		});

		return observer;
	}

	getAllElements () {
		const { selector } = this;
		return [...document.querySelectorAll(`img${selector}, iframe${selector}`)];
	}

	ignoreLazyload () {
		this.getAllElements().forEach(element => {
			element.src = element.dataset.src;
		});
	}

	translateSrcset(element) {
		if (element instanceof HTMLPictureElement) {
			[...element.querySelectorAll("[data-srcset]")].forEach(source => {
				source.srcset = source.dataset.srcset;
			});
		}
	}

	runLazyload () {
		const { placeholder } = this.options;
		const elements = this.getAllElements();

		elements.forEach(element => {
			const observer = this.createObserver();
			observer.observe(element);

			element.addEventListener("error", () => {
				if (placeholder && element.className.indexOf("error") === -1) {
					element.src = placeholder;
				}

				element.classList.add("error");
				element.classList.remove("loaded");
			});
		});
	}
}