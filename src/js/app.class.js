(() => {
    'use strict';

    const Xhr = require('./xhr.class.js');
    const List = require('./list.class.js');
    const Details = require('./details.class.js');

    const xhr = new Xhr({
        json: true
    });

    /**
     * @exports base/app
     * @requires xhr
     * @requires base/app/list
     * @requires base/app/details
     * @author Ihor Gevorkyan (MAF)
     */
    class App {
        /**
         * The general class of application
         * @param {object} ops - Options of app
         * @param {string} ops._widgetListID - The ID selector of list area in sidebar
         * @param {string} ops._tplList - The ID selector of list template
         * @param {string} ops._blockDetailsID - The ID selector of details element in DOM
         * @param {string} ops._tplDetails - The ID selector of details template
         * @param {string} ops._clientInListElementClass - The CLASS selector of content node of client in list item
         * @param {string} ops._fileName - The name of file with data
         */
        constructor(ops) {
            this.ops = ops || {};
            this.data = [];
            this.details = {};
            this.isLoaded = false;

            // defining properties for elements
            this.widgetListElement = '';
            this.itemListTemplateElement = '';
            this.blockDetailsElement = '';
            this.detailsTemplateElement = '';
            this.clientsNodesInList = [];

            this.getData();
        }

        /**
         * The method for getting the data from the file, name of which is in options
         * @see [xhr#get]{@link module:xhr#get}
         * @see [base/app#generateList]{@link module:base/app#generateList}
         * @returns {boolean|*} Returns `false` if hasn`t name of file,
         * if the data were got then the method start a next method
         */
        getData() {
            if (!this.ops._fileName)
                return false;

            xhr.get(this.ops._fileName)
                .then(response => {
                    this.data = response;
                    this.generateList(this.data);
                }, error =>
                    console.debug('Can`t get the data', error)
                );
        }

        /**
         * Calls the generator of list and inserts the list of clients into sidebar
         * @see [base/app/list]{@link module:base/app/list}
         * @param {Array} data - The array of objects with data of clients
         * @returns {Promise} The method returns `promise` for adding the event listeners `onclick` to items of a new list
         */
        generateList(data) {
            let _that = this;

            return new Promise(function (resolve) {
                if (!_that.ops._tplList || !_that.ops._widgetListID || !data)
                    return false;

                _that.widgetListElement = document.getElementById(_that.ops._widgetListID);
                _that.itemListTemplateElement = document.getElementById(_that.ops._tplList);

                let listNavigationElement = _that.widgetListElement.querySelector('nav');

                if (listNavigationElement !== null)
                    __.removeChild(_that.widgetListElement, listNavigationElement);

                let clientsList = new List({
                    listTemplate: _.template(_that.itemListTemplateElement.innerHTML),
                    items: data
                });

                _that.widgetListElement.appendChild(clientsList.getList());
                _that.isLoaded = true; // must be changed after appending was finished
                _that.clientsNodesInList = document.getElementsByClassName(_that.ops._clientInListElementClass);

                (data.length)
                    ? _that.generateDetails(data[0]) // set the details block if the list data is not empty
                    : _that.removedDetails(); // remove the details block if the list data is empty

                resolve(true);
            });
        }

        /**
         * Sets the active item by email of list and resets others
         * @param {string} email - The email for identification of client
         */
        setActiveClientInList(email) {
            let modifierClass = this.ops._clientInListElementClass + '--active';

            for (var i = 0, length = this.clientsNodesInList.length; i < length; i++) {
                (this.clientsNodesInList[i].dataset.href === email)
                    ? __.addClass(this.clientsNodesInList[i], modifierClass)
                    : __.removeClass(this.clientsNodesInList[i], modifierClass);
            }
        }
        
        /** Cleans details block */
        removedDetails() {
            if (!this.blockDetailsElement)
                return false;

            let contentDetailsElement = this.blockDetailsElement.querySelector('div[data-email]');

            if (contentDetailsElement !== null)
                __.removeChild(this.blockDetailsElement, contentDetailsElement);
        }

        /**
         * Calls the generator of details and inserts the results into details node
         * @see [base/app/details]{@link module:base/app/details}
         * @param {object} data - The data of choosen client
         * @returns {boolean|*} Returns `false` if hasn`t the needed options
         */
        generateDetails(data) {
            if (!this.ops._tplDetails || !this.ops._blockDetailsID || !data)
                return false;

            this.details = data;
            this.blockDetailsElement = document.getElementById(this.ops._blockDetailsID);
            this.detailsTemplateElement = document.getElementById(this.ops._tplDetails);

            this.removedDetails(); // remove the details block when we set a new details

            let clientDetails = new Details({
                detailsTemplate: _.template(this.detailsTemplateElement.innerHTML),
                item: this.details
            });

            this.blockDetailsElement
                .insertAdjacentHTML('afterBegin', clientDetails.renderDetails());

            this.setActiveClientInList(this.details.contact.email);
        }
    }

    module.exports = App;
})();