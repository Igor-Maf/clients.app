;(() => {
    'use strict';

    /**
     * @exports base/app/list
     * @author Ihor Gevorkyan (MAF)
     */
    class List {
        /**
         * Create a List Generator instance
         * @param {object} options - Options of request
         * @param {*} options.listTemplate - The template of list
         * @param {Array} options.items - The data
         */
        constructor(options) {
            this.options = options || {};
            this.listBlock = '';
        }

        /**
         * Returns the DOM node of finished list
         * @returns {string|*}
         */
        getList() {
            if (!this.listBlock)
                this.renderList();

            return this.listBlock;
        }

        /**
         * Creates a new DOM node and inserts the generated list to him,
         * defines result to `listBlock` property of class
         */
        renderList() {
            let interior = this.options.listTemplate({
                items: this.options.items
            });

            this.listBlock = document.createElement('nav');
            this.listBlock.insertAdjacentHTML('afterBegin', interior);
        }
    }

    module.exports = List;
})();