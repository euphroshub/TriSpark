// store
export const Store = {
	// app
	app: {
		theBody: document.body,
		theContainer: null,
		lifeCycleReady: false,
		firstLoadDelay: 2000,
		responsive: null,
		lang: null
	},

	// scrollbar
	scrollbar: null,

	// navigation
	navigation: null,

	// collapse
	collapse: null,

	// spacer
	spacer: null,

	// Sliders 
	Sliders: [],

	// google map
	mapIsLoaded: false,
	mapItems: [],

	// WatchScroll (null | object)
	watchscroll: null
};

export function StoreUpdate() {
	// Update store values if needed
	Store.app.theBody = document.body;
	Store.app.theContainer = document.querySelector('.js-siteContainer');
}