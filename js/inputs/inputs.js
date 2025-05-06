// import Store
import { Store } from '../store/store';

export default class Inputs {

    // call in lifecycle.js -> lifeCycleGlobalUpdate()
    static init() {
        const inputs = Store.app.theContainer.querySelectorAll('.js-label input, .js-label textarea');
        
        inputs.forEach(input => {
            
            input.addEventListener('focusin', (event) =>{
                event.target.parentElement.classList.add('is-up');                
            });

            input.addEventListener('focusout', (event) =>{
                Inputs.checkInput(event.target);
            });

            Inputs.checkInput(input);
        });

        Inputs.addGlobalEventListener();
    }

    static checkInput(input) {
        if (input) {
            if (input.tagName.toLowerCase() == 'input' || input.tagName.toLowerCase() == 'textarea') {
                if (input.value.length == 0) {
                    input.parentElement.classList.remove('is-up');
                } else {
                    input.parentElement.classList.add('is-up');
                }
            }
        }
    }

    // call in lifecycle.js -> lifeCycleGlobalUpdate()
    static initCheckAutofill() {
        // Need to use blur and not change event
        // as Chrome does not fire change events in all cases an input is changed
        // (e.g. when starting to type and then finish the input by auto filling a username)
        Inputs.addGlobalEventListener('blur', function (target) {
            // setTimeout needed for Chrome as it fills other
            // form fields a little later...
            window.setTimeout(function () {
                Inputs.checkInput(target);
            }, 20);
        });
    }

    static addGlobalEventListener(eventName, listener) {
        // Use a capturing event listener so that
        // we also get the event when it's stopped!
        // Also, the blur event does not bubble.
        if (!document.body.addEventListener) {
            document.body.attachEvent(eventName, onEvent);
        } else {
            document.body.addEventListener(eventName, onEvent, true);
        }

        function onEvent(event) {
            const target = event.target;
            listener(target);
        }
    }
}