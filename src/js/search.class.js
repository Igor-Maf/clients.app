(() => {
    'use strict';

    /*
     * todo
     * You can rewrite this module to one function and export only she,
     * if the app will never have the additional searching algorithms
     */

    /**
     * @exports base/search
     * @author Ihor Gevorkyan (MAF)
     */
    class Search {
        /**
         * Create an Search instance
         * @param {string} query - The string value which will be converted to regular expression
         * @param {Array} data - The collection of data which will be filtered by search query
         * @returns {Array} Returns the filtered collection of objects with data of clients
         */
        static searchByValue(query, data) {
            if (!query || typeof query !== 'string')
                return data;

            if (!data || !Array.isArray(data))
                return [];

            let expression = new RegExp(query, "i");
            let filteredItems = [];
            // console.debug("Inputed expression: ", expression);

            if (Array.isArray(data)) {
                _(data).forEach((object) => {
                    let itemCollection = _.valuesIn(object); // convert sub objects to collection [{}, {}, ...]

                    _(itemCollection).forEach((subObject) => {
                        for (let property in subObject) {
                            if (subObject[property].search(expression) !== -1) { // checking each value of property for coincidence
                                if (_.find(filteredItems, (obj) => obj.contact.email === object.contact.email))
                                    continue;

                                filteredItems.push(object);
                            }
                        }
                    });
                });
            }

            return filteredItems;
        }
    }

    module.exports = Search;
})();
