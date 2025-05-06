// Store import
import { Store } from '../store/store';

// Navigation created in store.js
export class Navigation {

    // Constructor
    constructor(_params) {
        this.elements = {
            ..._params.elements
        },

        this.watching = null,

        this.states = {
            hamburger: false,
            sticky: false,
            visibility: true,
        }

        this.settings = {
            nav: {
                activeClass: 'is-nav-active',
                stickyClass: 'is-sticky',
                hiddenClass: 'is-hidden'
            },

            body: {
                activeClass: 'nav-active'
            }
        }

        this.elementsTree = [];

        window.addEventListener('resize', () => {
            this.updateBannerSpacer();
        });
    }

    // Get navHeight
    get navHeight() {
        return this.elements.nav.height;
    }

    // Init
    static init() {
        // Getting the elements
        const siteNav = Store.app.theBody.getElementsByClassName('js-siteNav')[0];
        const siteNavWidth = siteNav.getBoundingClientRect().width;
        const hamburger = Store.app.theBody.getElementsByClassName('js-hamburger')[0];
        let header = Store.app.theContainer.getElementsByClassName('js-header');
        let header_height = Store.scrollbar.screenHeight;

        if (header.length > 0) {
            header.length > 0 ? header = header[0] : null;
            header_height = header.scrollHeight;
        }

        // Create the object and push it into the store
        const params = {
            elements: {
                nav: {
                    element: siteNav,
                    height: null,
                    width: siteNavWidth
                },
                hamburger: hamburger,
                header: {
                    element: header,
                    height: header_height
                }
            }
        }

        const obj = new Navigation(params);
        Store.navigation = obj;

        // Init methods
        obj.hamburgerInit();
        obj.createSubLevel();
        obj.subLevelToggle();
        // Storing nav height after the init
        obj.updateNavHeight();

        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            obj.updateBannerSpacer();
        }, 100);
    }

    // Hamburger
    hamburgerInit() {
        const hamburger = this.elements.hamburger;
        hamburger.addEventListener('click', this.hamburgerToggle.bind(this));
    }

    hamburgerToggle() {
        const currentState = this.states.hamburger;

        if (currentState === false) {
            this.navigationToggle('open');
            return
        }

        this.navigationToggle('close');
    }

    // Navigation toggle - fixed for mobile navigation
    navigationToggle(state) {
        const nav = this.elements.nav.element;
        const hamburger = this.elements.hamburger;
        const navActiveClass = this.settings.nav.activeClass;
        const bodyActiveClass = this.settings.body.activeClass;

        // Set the state based on the action
        if (state === 'open') {
            this.states.hamburger = true;
            nav.classList.add(navActiveClass);
            hamburger.classList.add(navActiveClass);
            Store.app.theBody.classList.add(bodyActiveClass);
            
            // Set nav height for mobile
            if (Store.scrollbar.screenWidth < 1200) {
                const navHeight = window.innerHeight - nav.getBoundingClientRect().height;
                nav.style.setProperty('--nav-height', `${navHeight}px`);
            }
        } else if (state === 'close') {
            this.states.hamburger = false;
            nav.classList.remove(navActiveClass);
            hamburger.classList.remove(navActiveClass);
            Store.app.theBody.classList.remove(bodyActiveClass);
            // Closing sublevel
            this.closeSubLevel();
        }
        this.updateBannerSpacer();
    }

    // Watcher - called in scrollbar.js -> on scroll
    watch(y) {
        // Handling the visibility
        this.checkVisibility(y);

        // p-e pas besoin de sticky sur ce site - a test
        const navStickyClass = this.settings.nav.stickyClass;

        if (y > 0) {
            this.elements.nav.element.classList.add(navStickyClass);
            this.states.sticky = true;
            return
        }

        this.elements.nav.element.classList.remove(navStickyClass);
        this.states.sticky = false;
    }

    checkVisibility(y) {
        const trigger = this.elements.header.height;
        const navHiddenClass = this.settings.nav.hiddenClass;

        if (y > trigger) {
            this.states.visibility = false;
            this.elements.nav.element.classList.add(navHiddenClass);
        }

        if (Store.app.theBody.classList.contains('is-scrolling-up')) {
            this.states.visibility = true;
            this.elements.nav.element.classList.remove(navHiddenClass);
        }
    }

    // Sub levels
    createSubLevel() {
        const wrapper = this.elements.nav.element;
        const items = wrapper.querySelectorAll('li');

        items.forEach(item => {
            const subList = item.querySelector('ul');
            const span = item.querySelector('span');

            if (subList && span) {
                item.classList.add('has-children');
                const subListHeight = subList.scrollHeight;
            
                // Creating the buttons

                // Mobile button
                const buttonTemplate = () => {
                    return `
                        <button type="button" class="js-toggle-button">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="#ffffff"/></svg>
                        </button>
                    `;
                }

                // Inserting the button
                span.insertAdjacentHTML('beforeend', buttonTemplate());

                const button = item.querySelector('.js-toggle-button');

                const obj = {
                    parent: item,
                    button: button,
                    element: subList,
                    height: subListHeight,
                    state: {
                        open: false,
                    },
                    settings: {
                        activeClass: 'is-open'
                    }
                }
                
                // Pushing the obj in the array
                this.elementsTree.push(obj);
            }
        });
    }

    // Sublevel toggle
    subLevelToggle() {
        const tree = this.elementsTree;

        tree.forEach(item => {
            const button = item.button;
            button.addEventListener('click', () => {
                if (Store.scrollbar.screenWidth < 1200) {
                    const state = item.state.open;
                    const parent = item.parent;
                    const activeClass = item.settings.activeClass;
                    const subList = item.element;
                    const subListHeight = subList.scrollHeight;
                    item.height = subListHeight;

                    if (!state) {
                        this.closeSubLevel();

                        parent.classList.add(activeClass);
                        subList.style.height = subListHeight + 'px';
                        item.state.open = true;
                        return
                    }

                    parent.classList.remove(activeClass);
                    subList.style.height = '0px';
                    item.state.open = false;
                }
            });

            setTimeout(function() {
                const parent = item.parent;
                const subList = item.element;
                const subListHeight = subList.scrollHeight;
                item.height = subListHeight;

                parent.addEventListener('mouseenter', () => {
                    if (Store.scrollbar.screenWidth > 1199) {
                        const navHeight = Store.navigation.elements.nav.element.getBoundingClientRect().height;
                        subList.style.height = item.height + 'px';
                        subList.style.maxHeight = Store.scrollbar.screenHeight - navHeight + 'px';
                        item.state.open = true;
                    }
                });

                parent.addEventListener('mouseleave', () => {
                    if (Store.scrollbar.screenWidth > 1199) {
                        subList.style.height = '0px';
                        item.state.open = false;
                    }
                });
            }, 100);
        });
    }

    // Close all sublevel
    closeSubLevel() {
        const tree = this.elementsTree;

        tree.forEach(item => {
            const parent = item.parent;
            const subList = item.element;
            const activeClass = item.settings.activeClass;

            parent.classList.remove(activeClass);
            subList.style.height = '0px';
            item.state.open = false;
        });
    }

    // Update nav height
    updateNavHeight() {
        const nav = this.elements.nav.element;
        const navHeight = nav.getBoundingClientRect().height;
        this.elements.nav.height = navHeight;
        this.updateBannerSpacer();
    }
    
    // Global update for navigation and elements
    globalUpdateNavAndElements() {
        this.updateNavHeight();
        
        // Update sublevel heights
        this.elementsTree.forEach(item => {
            const subList = item.element;
            const subListHeight = subList.scrollHeight;
            item.height = subListHeight;
            
            if (item.state.open) {
                subList.style.height = subListHeight + 'px';
            }
        });
    }

    updateBannerSpacer() {
        const bannerSpacer = document.querySelector('.js-banner-spacer');
        if (bannerSpacer) {
            const nav = this.elements.nav.element;
            const navHeight = nav.offsetHeight;
            bannerSpacer.style.paddingTop = `${navHeight}px`;
        }
    }
}