export default class Collapse {
	constructor(elements, responsive) {
		this.elements = elements;
		this.responsive = responsive;
	}

	static createCollapsible(_params) {
		const p = _params;
	
		let blockClass = 'js-blockCollapse';
		let buttonClass = 'js-blockCollapseToggle';
		let innerClass = 'js-blockCollapseInner';
		let responsive = false;
		let elements = [];

		if (p) {
			blockClass = p.blockClass ? p.blockClass : blockClass;
			buttonClass = p.buttonClass ? p.buttonClass : buttonClass;
			innerClass = p.innerClass ? p.innerClass : innerClass;
			responsive = p.responsive ? p.responsive : false;
			elements = p.elements ? p.elements : elements;
		}

		const blocks = elements.length > 0 ? elements : document.querySelectorAll(`.${blockClass}`);

		// setup obj
		blocks.forEach(block => {
			const button = block.querySelector(`.${buttonClass}`);
			const inner = block.querySelector(`.${innerClass}`);
			const innerHeight = inner.firstElementChild.scrollHeight;
			const blockBreakpoint = block.dataset.end;
			const group = block.dataset.group;
			const id = block.id;
			let state = true;

			// const hasInitinalState = block.dataset.open;
			// if (hasInitinalState) {
			// 	if (hasInitinalState == 'true') {
			// 		state = true;
			// 	}
			// }

			// if have breakpoint and style inner overflow
			if (blockBreakpoint && responsive) {
				const isBreakpointActive = responsive.isBreakpointActive(blockBreakpoint);

				if (!isBreakpointActive) {
					inner.style.overflow = 'hidden';
				}
				if (isBreakpointActive) {
					inner.style.overflow = 'visible';
					button.disabled = true;
					block.classList.add('kill-collapse');
				}
			}

			if (!blockBreakpoint) {
				inner.style.overflow = 'hidden';
			}

			// create obj
			const obj = {
				block: block,
				button: button,
				inner: inner,
				innerHeight: innerHeight,
				state: state,
				group: group ? group : false,
				blockBreakpoint: blockBreakpoint ? blockBreakpoint : false,
				id: id ? id : false
				// hasInitinalState: hasInitinalState,
			}

			elements.push(obj);
		});

		// init click listener
		const obj = new Collapse(elements, responsive);
		obj.update();
		obj.initItemListener();

		return obj
	}

	initItemListener() {
		this.elements.forEach(element => {
			const button = element.button;
			button.addEventListener('click', () => {
				this.update(element);
			})
		})
	}

	update(element) {
		// if no element
		if (!element) {
			this.elements.forEach(element => {
				const state = element.state;
				const blockBreakpoint = element.blockBreakpoint;
				const isBreakpointActive = this.responsive.isBreakpointActive(blockBreakpoint);
				
				// if block breakpoint
				if (blockBreakpoint) {
					if (!isBreakpointActive) {
						if (state) {
							element.block.classList.remove('is-open');
							element.inner.firstElementChild.style.height = `0px`;
						}

						if (!state) {
							element.block.classList.add('is-open');
							element.inner.firstElementChild.style.height = `${element.innerHeight}px`;
		
							// element.hasInitinalState = '';
						}
					}
	
					if (isBreakpointActive) {
						element.block.classList.remove('is-open');
						element.inner.firstElementChild.style.height = 'auto';
					}

					// flip the state
					element.state = !state;

					return
				}

				// if no breakpoint
				if (state) {
					element.block.classList.remove('is-open');
					element.inner.firstElementChild.style.height = `0px`;
				}

				if (!state) {
					element.block.classList.add('is-open');
					element.inner.firstElementChild.style.height = `${element.innerHeight}px`;

					// element.hasInitinalState = '';
				}

				// flip the state
				element.state = !state;

				// if (element.hasInitinalState == 'true') {
				// 	element.block.classList.add('is-open');
				// 	element.inner.firstElementChild.style.height = `${element.innerHeight}px`;

				// 	element.state = true;
				// 	element.hasInitinalState = null;
				// }
			})
		}

		// if element
		if (element) {
			const received_element = element;
			const clicked_group = element.group;

			// close the previous element from the same group
			this.elements.forEach(element => {
				if (element != received_element) {
					const state = element.state;
					const group = element.group;

					if (state && clicked_group && clicked_group == group) {
						element.state = false;
						element.block.classList.remove('is-open');
						element.inner.firstElementChild.style.height = `0px`;
					}
				}
			});
			
			// open or close the received element
			const state = element.state;

			if (state) {
				element.block.classList.remove('is-open');
				element.inner.firstElementChild.style.height = `0px`;
			}

			if (!state) {
				element.block.classList.add('is-open');
				element.inner.firstElementChild.style.height = `${element.innerHeight}px`;
			}

			// flip the state
			element.state = !state;
		}
	}

	updateOnResize() {
		this.elements.forEach(element => {
			const state = element.state;

			// if no block breakpoint
			if (!element.blockBreakpoint) {
				// if open
				if (state) {
					element.inner.firstElementChild.style.height = 'auto';
					element.innerHeight = element.inner.firstElementChild.scrollHeight;
					element.inner.firstElementChild.style.height = `${element.innerHeight}px`;
					return
				}
				// if close update innerHeight
				element.innerHeight = element.inner.firstElementChild.scrollHeight;

				return;
			}

			// if block breakpoint
			const isBreakpointActive = this.responsive.isBreakpointActive(element.blockBreakpoint);
			
			// if breakpoint is not active
			if (!isBreakpointActive) {
				element.inner.style.overflow = 'hidden';
				element.button.disabled = false;
				element.block.classList.remove('kill-collapse');

				// if open
				if (state) {
					element.inner.firstElementChild.style.height = 'auto';
					element.innerHeight = element.inner.firstElementChild.scrollHeight;
					element.inner.firstElementChild.style.height = `${element.innerHeight}px`;

					return;
				}
				// if close update innerHeight
				element.innerHeight = element.inner.firstElementChild.scrollHeight;
				element.inner.firstElementChild.style.height = `0px`;
				
				return;
			}
			
			// if breakpoint is active
			if (state) {
				element.block.classList.remove('is-open');
				element.state = !state;
			}
			element.inner.style.overflow = 'visible';
			element.button.disabled = true;
			element.block.classList.add('kill-collapse');
			element.innerHeight = 'auto';
			element.inner.firstElementChild.style.height = `${element.innerHeight}`;
		});
	}
}