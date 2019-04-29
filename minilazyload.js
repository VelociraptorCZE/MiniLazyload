/**
 * MiniLazyload
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default class MiniLazyload {
	constructor (options = {}, selector = "[loading=lazy]") {
		if (!("loading" in HTMLImageElement)) {
			this.selector = selector;
			this.options = options;
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
		const { threshold } = this.options;
		const observer = new IntersectionObserver(([{ intersectionRatio, target }]) => {
			if (intersectionRatio >= (threshold || .05)) {
				observer.unobserve(target);
				target.src = target.dataset.src;
			}
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

	runLazyload () {
		const { placeholder } = this.options;
		const elements = this.getAllElements();

		elements.forEach(element => {
			const observer = this.createObserver();
			observer.observe(element);

			element.addEventListener("error", e => {
				if (placeholder) {
					e.preventDefault();
					element.src = placeholder;
				}
			});
		});
	}
}