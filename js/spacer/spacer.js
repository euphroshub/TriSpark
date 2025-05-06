// Store import
import { Store } from '../store/store';

// Spacer created in store.js
export default class Spacer {
    // Constructor
    constructor(_params) {
        this.elements = {
            ..._params.elements
        }
    }

    // Spacer Init
    static init() {

        // Getting elements
        const siteNav = Store.navigation ? Store.navigation.elements.nav.element : null;
        const bannerSpacer = Store.app.theBody.getElementsByClassName('js-banner-spacer')[0];

        if (siteNav && bannerSpacer) {

            // Get navigation height
            const navHeight = Store.navigation.navHeight;

            // Create an object and push it into the store
            const params = {
                elements: {
                    nav: {
                        element: siteNav,
                        height: navHeight
                    },
                    
                    bannerSpacer: bannerSpacer
                }
            }

            const obj = new Spacer(params);
            Store.spacer = obj;

            // Init
            obj.createBannerSpacer();
        }
    }

    // Creating the spacer
    createBannerSpacer() {
        const navHeight = this.elements.nav.height;
        const bannerSpacer = this.elements.bannerSpacer;
        bannerSpacer.style.height = navHeight + 'px';
    }

    // Updating the spacer height on resize and on scroll -> called in scrollbar.js
    updateBannerSpacerHeight() {
        const bannerSpacer = this.elements.bannerSpacer;

        // Getting the updated nav height
        const navHeight = Store.navigation.navHeight;

        this.elements.nav.height = navHeight;
        bannerSpacer.style.height = navHeight + 'px';
    }
}