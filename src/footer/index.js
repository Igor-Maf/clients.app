((d) => {
    'use strict';

    class Footer {
        constructor(width, height) {
            this.name = 'Footer';
            this.class = 'footer';
        }

        getClass() {
            return this.class;
        }

        getName() {
            return this.name;
        }
    }

    module.exports = Footer;
})(document);
