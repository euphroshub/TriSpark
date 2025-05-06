// To animate the headers after the page loader in js/transitions.js with the watchscroll item classes
export class InitialAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Function to animate elements
        const animateElements = () => {
            const elements = document.querySelectorAll('.js-watch-scroll-item.to-anim');
            
            // Add a longer delay between each element's animation
            elements.forEach((element, index) => {
                // Increased delay between elements from 100ms to 150ms
                setTimeout(() => {
                    element.classList.add('is-visible');
                }, index * 150);
            });
        };

        // Check if first load is already complete
        if (document.body.classList.contains('js-first-load-complete')) {
            // Add a small delay before starting animations on page transitions
            setTimeout(animateElements, 100);
        } else {
            // Wait for the first load to complete
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList.contains('js-first-load-complete')) {
                        // Add a small delay before starting animations on first load
                        setTimeout(animateElements, 200);
                        observer.disconnect();
                    }
                });
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        // Handle page transitions
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && !link.target && !e.ctrlKey && !e.metaKey) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/') && !href.startsWith('//')) {
                    e.preventDefault();
                    // Add loading state
                    document.body.classList.add('js-page-loading');
                    // Navigate after a small delay
                    setTimeout(() => {
                        window.location.href = href;
                    }, 100);
                }
            }
        });
    }
} 