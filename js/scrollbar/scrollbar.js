// import store
import { Store } from '../store/store';

// import custom
import {getCoords} from '../helpers/helpers';

export default class Scrollbar {
	constructor(params) {
		// scroll values
		this.x = params.x;
		this.y = params.y;
		this.prev_x = params.x;
		this.prev_y = params.y;

		// scroll direction
		this.directionX = 0;
		this.directionY = 0;
		
		// window values
		this.screenWidth = params.screenWidth;
		this.screenHeight = params.screenHeight;
	}

	/*
	 * create
	 */
	static create(_params = null) {
		const params = {
			// scroll values
			x: window.pageXOffset,
			y: window.pageYOffset,
			prev_x: null,
			prev_y: null,

			// scroll direction
			directionX: 0,
			directionY: 0,

			// window values
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
		}

		const obj = new Scrollbar(params);
		obj.initScrollListener();

		return obj;
	}

	// ** initScrollListener ** //
	initScrollListener() {
		window.addEventListener('scroll', () => {
			if (!Store.ticking) {
				window.requestAnimationFrame(() => {
					this.update();
					
					if (Store.app.lifeCycleReady && Store.navigation) {
						const world = this.world;
						Store.navigation.watch(this.y);
						if (Store.watchscroll) {
							Store.watchscroll.watch(world);
						}
						if(this.y == 0) {
							setTimeout(() => {
								if (Store.spacer) {
									Store.spacer.updateBannerSpacerHeight();
								}
							}, 450);
						}
					}
				});
				Store.ticking = true;
			}
		});

		window.addEventListener('resize', () => {
			this.screenWidth = window.innerWidth;
			this.screenHeight = window.innerHeight;
		});
	}

	// ** update ** //
	update() {
		// Get scroll values
		this.x = window.pageXOffset;
		this.y = window.pageYOffset;

		// Get direction
		this.directionX = this.x - this.prev_x;
		this.directionY = this.y - this.prev_y;

		// Update prev values
		this.prev_x = this.x;
		this.prev_y = this.y;

		// Update body classes
		if (this.directionY > 0) {
			Store.app.theBody.classList.add('is-scrolling-down');
			Store.app.theBody.classList.remove('is-scrolling-up');
		} else if (this.directionY < 0) {
			Store.app.theBody.classList.add('is-scrolling-up');
			Store.app.theBody.classList.remove('is-scrolling-down');
		}

		// Reset ticking
		Store.ticking = false;
	}

	// ** getWorld ** //
	get world() {
		return {
			x: this.x,
			y: this.y,
			directionX: this.directionX,
			directionY: this.directionY,
			screenWidth: this.screenWidth,
			screenHeight: this.screenHeight
		}
	}

	// ** getDirection ** //
	getDirection() {
		return {
			x: this.directionX,
			y: this.directionY
		}
	}

	// ** scrollToTop ** //
	scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	// ** scrollTo ** //
	scrollTo(y) {
		window.scrollTo({
			top: y,
			behavior: 'smooth'
		});
	}

	// ** scrollToTarget ** //
	scrollToTarget() {
		const targetLinks = document.querySelectorAll('.js-scroll-to-target');
		
		targetLinks.forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				
				const targetSelector = link.getAttribute('data-scroll-target');
				if (!targetSelector) return;
				
				const targetElement = document.querySelector(targetSelector);
				if (!targetElement) return;

				// Use browser's native smooth scrolling
				targetElement.scrollIntoView({ 
					behavior: 'smooth',
					block: 'start'
				});
			});
		});
	}

	// ** getters ** //
	get direction() {
		return this.getDirection();
	}
}

// **---------------------------------------------------**
// -------------------------------------------------------
// on resize BEGIN
window.addEventListener('resize', function() {
	if (Store.app.lifeCycleReady) {
		if (Store.scrollbar.screenWidth > 1199) {
			Store.navigation.navigationToggle('close');
		}
		Store.scrollbar.update();
		Store.navigation.globalUpdateNavAndElements();
		if (Store.collapse) {
			Store.collapse.updateHeight();
		}
		Store.watchscroll.watch(Store.scrollbar.world);
		setTimeout(() => {
			Store.spacer.updateBannerSpacerHeight();
		}, 450);
	}
}, true);
// on resize END
// -------------------------------------------------------
// -------------------------------------------------------