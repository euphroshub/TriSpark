// Store
import { Store } from '../store/store';

export class BlockColor {

    static init() {
        const spacers = Store.app.theContainer.querySelectorAll('.js-banner-spacer');

        if (spacers.length > 0) {
            for (let i = 0; i < spacers.length; i++) {
                const spacer = spacers[i];
                const nextElement = spacer.nextElementSibling;
                
                // Check if nextElement exists before trying to get its computed style
                if (nextElement) {
                    const nextElementBgColor = window.getComputedStyle(nextElement).getPropertyValue('background-color');
                    if (nextElementBgColor && nextElementBgColor !== 'rgba(0, 0, 0, 0)') {
                        spacer.style.backgroundColor = nextElementBgColor;
                    }
                }
            }
        }
    }
} 