import { Store } from '../store/store';
import { lifeCycleGlobalUpdate } from '../lifecycle/lifecycle';
import WatchScroll from '../watchscroll/watchscroll';

export class PageLoader {
    constructor() {
        this.loadingScreen = document.querySelector('.js-loading-screen');
        this.init();
        this.initPageTransitions();
    }

    init() {
        // Add loading screen to body if it doesn't exist
        if (!this.loadingScreen) {
            this.createLoadingScreen();
        }

        // Hide loading screen after delay
        setTimeout(() => {
            this.hideLoadingScreen();
        }, Store.app.firstLoadDelay);
    }

    createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'c-loading-screen js-loading-screen';
        loadingScreen.innerHTML = `
            <div class="c-loading-screen__content">
                <img src="/logos/logomini-white.png" alt="VMM Logo" class="c-loading-screen__logo">
            </div>
        `;
        document.body.appendChild(loadingScreen);
        this.loadingScreen = loadingScreen;
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('c-loading-screen--hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                this.loadingScreen.remove();
                // Signal that first load is complete
                document.body.classList.add('js-first-load-complete');
                // Remove the permanent overlay
                document.body.classList.remove('js-page-loading');
            }, 500);
        }
    }

    initPageTransitions() {
        // Handle page transitions
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && !link.target && !e.ctrlKey && !e.metaKey) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/') && !href.startsWith('//')) {
                    e.preventDefault();
                    this.navigateToPage(href);
                }
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            // Use regular navigation for back/forward to ensure proper page state
            window.location.reload();
        });
    }

    navigateToPage(url, pushState = true) {
        // Show loading screen
        document.body.classList.add('js-page-loading');
        if (!this.loadingScreen) {
            this.createLoadingScreen();
        }

        // Fetch the new page
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Update the page content
                document.title = doc.title;
                document.querySelector('.js-siteContainer').innerHTML = 
                    doc.querySelector('.js-siteContainer').innerHTML;
                
                // Update URL if needed
                if (pushState) {
                    window.history.pushState({}, '', url);
                }
                
                // Reinitialize components
                lifeCycleGlobalUpdate();
                
                // Reinitialize WatchScroll with new elements
                Store.watchscroll = WatchScroll.createWorld();
                
                // Force a scroll update to trigger WatchScroll
                window.scrollTo(window.pageXOffset, window.pageYOffset);
                
                // Hide loading screen after delay
                setTimeout(() => {
                    this.hideLoadingScreen();
                    // Force another scroll update after animations
                    setTimeout(() => {
                        window.scrollTo(window.pageXOffset, window.pageYOffset);
                    }, 100);
                }, Store.app.firstLoadDelay);
            })
            .catch(error => {
                console.error('Error loading page:', error);
                // Fallback to regular navigation if fetch fails
                window.location.href = url;
            });
    }
}
