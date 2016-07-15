(() => {
    'use strict';

    /**
     * @exports base/app/details
     * @author Ihor Gevorkyan (MAF)
     */
    class Details {
        /**
         * The class generate a details of client from lodash template and needed data
         * @param {object} options - The object of options for generation
         * @param {*} options.detailsTemplate - The template for details
         * @param {object} options.item - The object of data about client
         */
        constructor(options) {
            this.ops = options || {};
            this.detailsBlock = '';
        }

        /**
         * Returns the generated node for details block
         * @returns {string}
         */
        renderDetails() {
            this.detailsBlock = this.ops.detailsTemplate({
                item: this.ops.item
            });

            return this.detailsBlock;
        }
    }
    
    module.exports = Details;
})();