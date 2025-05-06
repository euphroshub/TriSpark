
/*
* Librairie d'animation parallax. Cette librairie est fait pour
* fonctionner avec la custom scrollbar.
* (peut être tweaker pour fonctionner sans la scrollbar custom)
*
* - Ajax ready
*
* Pour "parallaxer" un element, simple ajouter la class 'js-parallax'. Le translateY 
* va être animé on scroll. Vous pouvez également définir la vitesse du translateY:
* simplement ajouter data-ys="X". Remplacer X par un chiffre. Plus le chiffre augmente,
* plus que l'intensité du parallax diminue (default: 5).
*/

// import constants
import Constants from '../constants/constants';

// watchscroll
import { WatchScroll } from '../watchscroll/watchscroll.js';


/* ---------------------------------------------------- */
// WatchScroll
export class Parallax {
	constructor(component, item, height, offsetTop, visible, speed) {
		this.component = component;
		this.height = height;
		this.offsetTop = offsetTop;
		this.visible = visible;
		this.speed = speed;
		this.item = item;
	}

	static setup() {
		let elements = document.getElementsByClassName('js-parallax');

		if (elements.length > 0 && Constants.screenWidth > 990) {
			for (let i = 0; i < elements.length; i++) {
				let c = elements[i];
				let component = c;
				let item = component.querySelector('.js-parallax-item');
				let bounding = component.getBoundingClientRect();
				let height = bounding.height;
				let offsetTop = bounding.top;
				let visible = WatchScroll.currentlyVisible(component);
				let speed = 20; // default

				if (item) {
					if (item.dataset.ys) {
						speed = item.dataset.ys;
					}
					
					let obj = new Parallax(component, item, height, offsetTop, visible, speed);

					/* push the object in the array */
					Constants.ParallaxItems.push(obj);

					/* init the object */
					obj.init(i);
				}
			}
		}
	}

	static watch() {
		if (Constants.ParallaxItems.length > 0) {
			for (let i = 0; i < Constants.ParallaxItems.length; i++) {
				let obj = Constants.ParallaxItems[i];
				let component = obj.component;
				let item = obj.item;

				// check visibility first and update the object property
				obj.visible = Parallax.visible(component);
				
				if (obj.visible) {
					item.style.transform = 'translate3d(0,'+ Parallax.calcul(obj.offsetTop, parseInt(obj.speed)) +'px, 0)';
				}
			}
		}
	}

	static visible(element) {
		return WatchScroll.currentlyVisible(element)
	}

	static calcul(offsetTop, speed) {
		return parseInt(( 0 + ( ((Constants.scrolled_y - offsetTop) / speed) )));
	}

	init(index) {
		let p = Constants.ParallaxItems[index];

		let item = p.item;
		item.style.transform = 'translate3d(0,'+ Parallax.calcul(this.offsetTop, this.speed) +'px, 0)';

		Parallax.watch();
	}
}