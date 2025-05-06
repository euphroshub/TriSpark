// import lifecycle
import {
	initLifeCycle,
} from './lifecycle/lifecycle.js';

// import initial animations
import { InitialAnimations } from './animations/initial-animations.js';

// **---------------------------------------------------**
// -------------------------------------------------------
// DOMContentLoaded BEGIN
document.addEventListener('DOMContentLoaded', function(e) {
	// lifecycle
	initLifeCycle();
	
	// Initialize initial animations to animate the headers
	new InitialAnimations();
});
// DOMContentLoaded END
// -------------------------------------------------------
// **---------------------------------------------------**