(() => {
    'use strict';

    /**
     * @exports core
     * @author Ihor Gevorkyan (MAF)
     */
    class CoreDOM {
        /**
         * The method for adding a new class to DOM node
         * @param {object} el - The DOM node
         * @param {string} additionalClass - The class name
         */
        static addClass(el, additionalClass) {
            if (el.classList)
                el.classList.add(additionalClass)
            else
                el.className += ' ' + additionalClass;
        }

        /**
         * The method for deleting the class from DOM node
         * @param {object} el - The DOM node
         * @param {string} deletableClass - The class name
         */
        static removeClass(el, deletableClass) {
            if (el.classList)
                el.classList.remove(deletableClass);
            else
                el.className = el.deletableClass.replace(
                    new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '
                );
        }

        /**
         * The method for checking of class in DOM node
         * @param {object} el - The DOM node
         * @param {string} className - Which class name we will search?
         * @returns {boolean} If the element has this class it returns `true`
         */
        static hasClass(el, className) {
            return (el.classList)
                ? el.classList.contains(className)
                : new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }

        /**
         * The method for removing the child node from parent DOM node
         * @param {object} parent - The parent DOM node
         * @param {object} child - The child DOM node
         */
        static removeChild(parent, child) {
            parent.removeChild(child);
        }
    }

    module.exports = CoreDOM;
})();