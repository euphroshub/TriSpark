export default class WatchScroll {
	constructor(params) {
		// view
		this.camera = params.camera;
		this.scene = params.scene;
		this.scrollValues = params.scrollValues;

		// DOM elements cache
		this.source = params.source;
		this.elements = params.elements;
		
		// settings
		this.settings = params.settings;
	}

	/*
	 * createWorld
	 */
	static createWorld(_settings) {
		const settings = {
			// default values
			selectClass: 'js-watch-scroll-item',
			visibleClass: 'is-visible',
			world: {
				x: window.pageXOffset,
				y: window.pageYOffset,
				w: window.innerWidth,
				h: window.innerHeight,
			},

			// override
			..._settings
		}

		// create view
		const camera = WatchScroll.createCamera();
		const scene = WatchScroll.createScene();
		const scrollValues = WatchScroll.createScrollValues();

		const selectClass = settings.selectClass;
		const source = WatchScroll.getSource(selectClass);
		const elements = WatchScroll.createElements(source);

		const params = {
			camera: camera,
			scene: scene,
			scrollValues: scrollValues,
			
			source: source,
			elements: elements,

			settings: settings,
		};

		return new WatchScroll(params);
	}

	/*
	 * Camera
	 */
	static createCamera() {
		const camera_view = {
			x: 0,
			y: 0,
			w: window.innerWidth,
			h: window.innerHeight
		}

		const params = {...camera_view}

		return params;
	}

	updateCameraPosition(world = null) {
		const camera_view = {
			x: window.pageXOffset,
			y: window.pageYOffset,
			w: window.innerWidth,
			h: window.innerHeight
		}

		if (world) {	
			const fields = world;
			for (const key in fields) {
				if (fields.hasOwnProperty(key)) {
					const k = key;
					const field = fields[k];

					if (camera_view.hasOwnProperty(k)) {
						camera_view[k] = field;
					}
				}
			}	
		}

		this.camera = camera_view;
	}

	getCameraCoordinates() {
		return this.camera;
	}

	/*
	 * Scene
	 */
	static createScene() {
		const scene_view = {
			x: 0,
			y: 0,
			w: document.documentElement.scrollWidth,
			h: document.documentElement.scrollHeight
		}

		const params = {...scene_view}

		return params;
	}

	/*
	 * ScrollValues
	 */
	static createScrollValues() {
		const scroll_values = {
			x: window.pageXOffset,
			y: window.pageYOffset,
			w: window.innerWidth,
			h: window.innerHeight,
		}

		const params = {...scroll_values}

		return params;
	}

	updateScrollValues(world = null) {	
		const scroll_values = {
			x: window.pageXOffset,
			y: window.pageYOffset,
			w: window.innerWidth,
			h: window.innerHeight,
		}

		if (world) {
			const fields = world;
			for (const key in fields) {
				if (fields.hasOwnProperty(key)) {
					const k = key;
					const field = fields[k];

					if (scroll_values.hasOwnProperty(k)) {
						scroll_values[k] = field;
					}
				}
			}	
		}

		this.scrollValues = scroll_values;
	}

	/*
	 * Source
	 */
	static getSource(cssClass) {
		return document.querySelectorAll(`.${cssClass}`);
	}

	/*
	 * Elements
	 */
	static createElements(_source) {
		const elements = [];

		for (let i = 0; i < _source.length; i++) {
			const element = _source[i];
			const settings = WatchScroll.createElementSettings(element);

			elements.push(settings);
		}

		return elements;
	}

	static createElementSettings(_element) {
		const settings = {
			element: _element,
			coords: {
				x: 0,
				y: 0,
				w: 0,
				h: 0,
			},
			visible: false,
		}

		return settings;
	}

	updateElementsPosition() {
		for (let i = 0; i < this.elements.length; i++) {
			const element = this.elements[i];
			const coords = this.getElementCoordinates(element.element);

			element.coords = coords;
		}
	}

	updateElementsVisibility() {
		const camera_coords = this.getCameraCoordinates();

		for (let i = 0; i < this.elements.length; i++) {
			const element = this.elements[i];
			const visible = this.getElementVisibility(element.element, camera_coords);

			element.visible = visible;

			if (visible) {
				element.element.classList.add(this.settings.visibleClass);
			} else {
				element.element.classList.remove(this.settings.visibleClass);
			}
		}
	}

	getElementCoordinates(_element) {
		const coords = {
			x: 0,
			y: 0,
			w: 0,
			h: 0,
		}

		const bounding = _element.getBoundingClientRect();
		const scrollValues = this.scrollValues;

		coords.x = bounding.left + scrollValues.x;
		coords.y = bounding.top + scrollValues.y;
		coords.w = bounding.width;
		coords.h = bounding.height;

		return coords;
	}

	getElementVisibility(_element, _camera_coords) {
		const element_coords = this.getElementCoordinates(_element);
		const visible_x = this.getElementVisibilityX(_element, element_coords, _camera_coords);
		const visible_y = this.getElementVisibilityY(_element, element_coords, _camera_coords);

		return visible_x && visible_y;
	}

	getElementVisibilityX(_element, _element_coords, _camera_coords) {
		const element_coords = _element_coords;
		const camera_coords = _camera_coords;

		const x_left = element_coords.x;
		const x_right = element_coords.x + element_coords.w;

		const camera_x_left = camera_coords.x;
		const camera_x_right = camera_coords.x + camera_coords.w;

		if (x_right < camera_x_left) {
			return false;
		}

		if (x_left > camera_x_right) {
			return false;
		}

		return true;
	}

	getElementVisibilityY(_element, _element_coords, _camera_coords) {
		const element_coords = _element_coords;
		const camera_coords = _camera_coords;

		const y_top = element_coords.y;
		const y_bottom = element_coords.y + element_coords.h;

		const camera_y_top = camera_coords.y;
		const camera_y_bottom = camera_coords.y + camera_coords.h;

		return this.getElementVisibilityY_top_bottom(_element, element_coords, camera_coords, y_top);
	}

	getElementVisibilityY_top_bottom(_element, _element_coords, _camera_coords, _y_top) {
		const element_coords = _element_coords;
		const camera_coords = _camera_coords;
		const y_top = _y_top;

		const y_bottom = element_coords.y + element_coords.h;
		const camera_y_top = camera_coords.y;
		const camera_y_bottom = camera_coords.y + camera_coords.h;

		if (y_bottom < camera_y_top) {
			return false;
		}

		if (y_top > camera_y_bottom) {
			return false;
		}

		return true;
	}

	/*
	 * watch
	 */
	watch(world = null) {
		this.updateCameraPosition(world);
		this.updateScrollValues(world);
		this.updateElementsPosition();
		this.updateElementsVisibility();
	}
} 