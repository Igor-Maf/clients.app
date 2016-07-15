(() => {
    'use strict';

    /**
     * todo
     * You can rewrite base module to class or object
     */

    /**
     * This is base definition for all composed classes defined by the system
     * @module base
     * @author Ihor Gevorkyan (MAF)
     * @require lodash
     * @requires core
     * @requires base/app
     * @requires base/search
     */
    
    window._ = require('lodash');
    window.__ = require('./js/core.class.js');
    const App = require('./js/app.class.js');
    const Search = require('./js/search.class.js');

    let app = new App({
        _widgetListID: 'clientsList',
        _tplList: 'tpl_clients-list',
        _blockDetailsID: 'clientDetails',
        _tplDetails: 'tpl_client-details',
        _clientInListElementClass: 'c-client',
        _fileName: 'clients.json'
    });

    // console.log(app);

    /**
     * The method is change the active item in list
     * @returns {boolean?}
     */
    function itemInListClicked() {
        if (__.hasClass(this, app.ops._clientInListElementClass + "--active"))
            return false;

        if (this.dataset.href) {
            let detailsDataByEmail = _.find(
                app.data,
                (obj) => obj.contact.email === this.dataset.href
            );

            app.generateDetails(detailsDataByEmail);
        }
    }

    /**
     * The method sets listeners onclick event to items in list
     * @returns {boolean?}
     */
    function setListenersToListItems() {
        if (!app.clientsNodesInList.length) {
            // console.log('The array of app.clientsNodesInList is empty');
            return false;
        }

        let listItems = app.clientsNodesInList;

        for (let i = 0, l = listItems.length; i < l; i++) {
            listItems[i].onclick = itemInListClicked;
        }
    }

    /**
     * The method sets event listener for `input` to search field
     */
    function setListenerToSearchInput() {
        let searchInput = document.getElementById('searchField');

        searchInput.addEventListener('input', function () {
            let filteredListData = Search.searchByValue(this.value, app.data);
            // console.log('All data: ', app.data);
            // console.log('Filtered data: ', filteredListData);

            app.generateList(filteredListData)
                .then(setListenersToListItems());
        }, false);
    }

    window.onload = () => {
        let checkingTime = 700,
            overlay = document.getElementById('overlay');

        let checkTheRender = setInterval(() => {
            if (app.isLoaded) {
                setListenersToListItems();
                setListenerToSearchInput();
                __.removeClass(overlay, 'overlay--is-active');
                // console.log('The check of loading all modules was stopped by true');
                clearInterval(checkTheRender);
                clearTimeout(stopChecking);
            }
        }, checkingTime);

        let stopChecking = setTimeout(() => {
            // console.log('The check of loading all modules was stopped by time');
            clearInterval(checkTheRender);
        }, checkingTime * 5);
    }
})();