// import store
import { Store } from '../store/store';

// ** Load fonts ** //
export function loadFonts() {
	// Our fonts are loaded via webpack and CSS
	return Promise.resolve();
}

// ** language ** //
export function getCurrentLang() {
	if (Store.app.lang) return Store.app.lang;

	return setCurrentLang();
}

export function setCurrentLang() {
	if (!Store.app.theContainer) {
		return console.warn('Please set a site container with the following class: js-siteContainer');
		//  false
	}

	if (Store.app.theContainer !== null ) {
		const lang = Store.app.theContainer.dataset.lang;

		if (lang == null) {
			return console.warn('Please set a default language attribute on your site container. Example: data-lang="fr"');
		}

		if (lang != null) {
			Store.app.lang = lang;
			return true
		}
	}

	return console.warn('No site container or default language was found. theContainer and lang wont be available in the Store');
}

// ** devices ** //
export function is_iOS() {
	const iDevices = [
		'iPad Simulator',
		'iPhone Simulator',
		'iPod Simulator',
		'iPad',
		'iPhone',
		'iPod'
	];

	if (!!navigator.platform) {
		while (iDevices.length) {
			if (navigator.platform === iDevices.pop()) {
				return true;
			}
		}
	}

	return false;
}

// ---------------------------
// BEGIN - get coords
export function getCoords(elem) { // crossbrowser version
	const box = elem.getBoundingClientRect();
	const body = document.body;
	const docEl = Store.scrollbar.custom ? Store.scrollbar.custom.scrollbar.contentWrapperEl : document.documentElement
	const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
	const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
	const clientTop = docEl.clientTop || body.clientTop || 0;
	const clientLeft = docEl.clientLeft || body.clientLeft || 0;
	const top  = box.top +  scrollTop - clientTop;
	const left = box.left + scrollLeft - clientLeft;
	return { top: Math.round(top), left: Math.round(left) };
}
// END - get offset top
// -------

// ---------------------------
// BEGIN -getParentByClassName
export function getParentByClassName(from, term) {
	let parent = from.parentElement;
	const search = term;
	let contains = parent.classList.contains(search) ? true : false;
	if (parent != null && !contains) {
		while (!contains) {
			parent = parent.parentElement;
			if (parent != null) {
				contains = parent.classList.contains(search) ? true : false;
				if (contains) {
					return parent;
				}
			}
			if (parent == Store.theBody) {
				console.error(`Could not find a match for getParentByClassName('${search}'), returning <body> as a fallback`);
				return Store.theBody;
			}
		}
	}
	return parent;
}
// END - getParentByClassName
// -------

// ---------------------------
// BEGIN -getNextSibling with this class
export function getNextSibling(elem, selector) {
    // Get the next sibling element
    let sibling = elem.nextElementSibling;

    // If there's no selector, return the first sibling
    if (!selector) return sibling;

    // If the sibling matches our selector, use it
    // If not, jump to the next sibling and continue the loop
    while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.nextElementSibling
    }
}
// END - getNextSibling
// -------

// ---------------------------
// BEGIN - add background on click to vimeo iframe
export function addBackgroundVimeoIframe() {
    const iframes = Store.app.theBody.getElementsByClassName('js-vimeo-iframe');

    if (iframes.length > 0) {
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            const contentDocument = iframe.contentDocument;
            const link = contentDocument.querySelector('a');
    
            link.addEventListener('click', () => {
                iframe.style.background = '#000';
            });
        }
    }
}
// END - add background on click to vimeo iframe
// -------

// ** get copyright year ** //
export function getCopyrightYear() {
	const startYear = 2015;
	const currentYear = new Date().getFullYear();
	return startYear === currentYear ? startYear : `${startYear}-${currentYear}`;
}

// ** Trail status ** //
export function getTrailStatus() {
    // Default status if none is set // update this to show status (open, closed, conditions)
    const setStatus = 'closed';
    
    // Get all status containers
    const statusContainers = document.querySelectorAll('.js-status');
    if (!statusContainers.length) {
        console.warn('No status containers found');
        return;
    }

    // Process each status container
    statusContainers.forEach(statusContainer => {
        // Hide all status elements first
        const allStatusElements = statusContainer.querySelectorAll('.status, .open, .closed, .conditions');
        allStatusElements.forEach(el => {
            el.style.display = 'none';
            el.classList.remove('currentStatus');
        });

        // Show the appropriate elements based on status
        switch (setStatus) {
            case 'open':
                statusContainer.querySelector('.status.is-open').style.display = 'inline-block';
                statusContainer.querySelector('.open').style.display = 'inline-block';
                break;
            case 'conditions':
                statusContainer.querySelector('.status.is-conditions').style.display = 'inline-block';
                statusContainer.querySelector('.conditions').style.display = 'inline-block';
                break;
            case 'closed':
            default:
                statusContainer.querySelector('.status.is-closed').style.display = 'inline-block';
                statusContainer.querySelector('.closed').style.display = 'inline-block';
                break;
        }
    });
}

// ** Table Trail Status ** //
export function getTableTrailStatus() {
    // Define trail statuses - use open, closed or work to update the table.
    const trailStatuses = {
        'El Camino': 'closed',
        'Paparmane': 'closed',
        'Racoon McSquare': 'closed',
        'Redneck': 'closed',
        'Legzpress': 'closed',
        'Bonhomme Bracket': 'closed',
        'L\'ACV': 'closed',
        'Écu Mauve': 'closed',
        'Wasabee': 'closed',
        'Root Beer': 'closed',
        'Black Jack': 'closed',
        'Stone': 'closed',
        'RootStone': 'closed',
        'Roulette Russe': 'closed'
    };

    // Get all trail rows
    const trailRows = document.querySelectorAll('.c-trailTable__table tbody tr');
    
    /*
    if (!trailRows.length) {
        console.warn('No trail rows found in the table');
        return;
    }
    */
   
    // Process each trail row
    trailRows.forEach(row => {
        const trailNameElement = row.querySelector('.trailName');
        if (!trailNameElement) return;

        const trailName = trailNameElement.textContent.split(' - ')[0]; // Get name without distance
        const statusElement = row.querySelector('.trailStatus');
        if (!statusElement) return;

        // Remove existing status classes
        statusElement.classList.remove('trailOpen', 'trailClosed', 'trailWork');
        
        // Get status from our defined statuses
        const status = trailStatuses[trailName] || 'closed'; // Default to closed if not found
        
        // Set the appropriate class and text
        switch (status) {
            case 'open':
                statusElement.classList.add('trailOpen');
                statusElement.textContent = 'Ouverte';
                break;
            case 'work':
                statusElement.classList.add('trailWork');
                statusElement.textContent = 'Travaux en cours';
                break;
            case 'closed':
            default:
                statusElement.classList.add('trailClosed');
                statusElement.textContent = 'Fermé';
                break;
        }
    });
}