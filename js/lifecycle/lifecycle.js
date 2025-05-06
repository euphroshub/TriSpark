// import store
import { Store, StoreUpdate } from '../store/store';

// helpers
import {
	is_iOS,
	loadFonts,
	setCurrentLang,
	getCopyrightYear,
	getTrailStatus,
	getTableTrailStatus
} from '../helpers/helpers.js';


// custom
import Scrollbar from '../scrollbar/scrollbar.js';
import Responsive from '../responsive/responsive.js';
import Collapse from '../collapse/collapse.js';
import WatchScroll from '../watchscroll/watchscroll.js';
import { Navigation } from '../navigation/navigation';
import Spacer from '../spacer/spacer';
import Inputs from '../inputs/inputs';
import { BlockColor } from '../blockcolor/blockcolor';
import { PageLoader } from '../transition/loader.js';

// ----------------------------------------
// ----------------------------------------
// export BEGIN

/* initLifeCycle */
export function initLifeCycle() {
	// Set initial loading state
	document.body.classList.add('js-page-loading');

	// Ensure page starts at top
	window.scrollTo(0, 0);
	
	StoreUpdate();
	loadFonts();

	// Initialize PageLoader for first load and page transition animation
	new PageLoader();

	// ** scrollbar ** //
	// init without custom scrollbar
	Store.scrollbar = Scrollbar.create();
	Store.scrollbar.scrollToTarget();

	// ** responsive ** //
	Store.app.responsive = Responsive.create();

	// ** dom ready** //
	domReady();
}

/* domReady */
export function domReady() {
	// Initialize navigation
	Navigation.init();
	
	// Initialize other components
	lifeCycleGlobalUpdate();
	Store.app.lifeCycleReady = true;

	// Update copyright year
	const copyrightYearElements = document.querySelectorAll('.copyright-year');
	if (copyrightYearElements.length) {
		const year = getCopyrightYear();
		copyrightYearElements.forEach(el => el.textContent = year);
	}

	// Trail status
	// Header + Footer
	getTrailStatus();

	// Table - Page sentiers
	getTableTrailStatus();

	// ** done first page load ** //
	setTimeout(function(){
		// Remove loading state and show content
		document.body.classList.remove('js-page-loading');
		document.body.classList.add('js-content-ready');
	}, Store.app.firstLoadDelay);

	// spacer
	Spacer.init();

	// BlockColor
	BlockColor.init();

	// Collapse
	Collapse.createCollapsible({
		responsive: Store.app.responsive
	});

	// WatchScroll
	Store.watchscroll = WatchScroll.createWorld();
}

/* lifeCycleGlobalUpdate */
export function lifeCycleGlobalUpdate() {
	// window.scrollTo(0, 0);
	StoreUpdate();
	Store.app.responsive.readBreakpoints();
	setCurrentLang();
	
	// inputs
	Inputs.initCheckAutofill();
	Inputs.init();

	// navigation
	Navigation.init();
	
	// spacer
	Spacer.init();

	// BlockColor
	BlockColor.init();

	// Collapse
	Collapse.createCollapsible({
		responsive: Store.app.responsive
	});

	// WatchScroll
	Store.watchscroll = WatchScroll.createWorld();

}