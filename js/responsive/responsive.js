export default class Responsive {
	constructor(params) {
		this.element = params.element;
		this.autoupdate = params.autoupdate;
		this.breakpoints = params.breakpoints;
	}

	static create() {
		const params = {
			element: document.body,
			autoupdate: true,
			breakpoint: false,
		}

		return new Responsive(params);
	}

	readBreakpoints() {
		if (window.getComputedStyle && (window.getComputedStyle(this.element, '::after').content !== '')) {
			const data = window.getComputedStyle(this.element, '::after').content;

			try {
				this.breakpoints = JSON.parse(Responsive.removeQuotes(data));
			} catch (err) {
				this.breakpoints = false;
			}
		} else {
			this.breakpoints = false;
		}

		return this.breakpoints;
	}

	getBreakpointValue(breakpoint, asNumber) {
		if (this.autoUpdate) {
			this.readBreakpoints();
		}

		if (!this.breakpoints || !this.breakpoints.hasOwnProperty(breakpoint)) {
			return false;
		}

		return asNumber ? parseFloat(this.breakpoints[breakpoint].value) : this.breakpoints[breakpoint].value;
	}

	getActiveBreakpoint() {
		if (this.autoUpdate) {
			this.readBreakpoints();
		}

		let largest = {name: false, value: 0};

		for (let breakpoint in this.breakpoints) {
			if (this.breakpoints.hasOwnProperty(breakpoint)) {
				let breakpointValue = parseFloat(this.breakpoints[breakpoint].value);

				if (this.breakpoints[breakpoint].active && (breakpointValue > largest.value)) {
					largest = {name: breakpoint, value: breakpointValue};
				}
			}
		}

		return largest.name;
	}

	isBreakpointNotActive(breakpoint) {
		return !this.isBreakpointActive(breakpoint);
	}

	isBreakpointActive(breakpoint) {
		if (this.autoUpdate) {
			this.readBreakpoints();
		}

		return this.breakpoints.hasOwnProperty(breakpoint) && this.breakpoints[breakpoint].active;
	}

	setUpdateMode(updateMode) {
		if (updateMode == 'manual') {
			this.autoUpdate = false;
			this.readBreakpoints();
		}
	}

	setElement(newElement) {
		this.element = newElement;
	}

	static removeQuotes(string) {
		if (typeof string === 'string' || string instanceof String) {
			string = string.replace(/[']/g, '"').replace(/\\|^[\s\S]{0,1}|[\s\S]$/g, '');
		}

		return string;
	}
}
