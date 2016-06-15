(() => {
    'use strict';

    let Footer = require('./footer');
    let footer1 =  new Footer();
    let footerClass = footer1.getClass();

    console.log(footerClass + 'test');
})();