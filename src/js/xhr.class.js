/**
 * @exports xhr
 * @classDesc You can see the guide at home page and details [here]{@link https://github.com/kysonic/xhr}
 * @author Anton Mirochnichenko (kysonic)
 */
class Xhr {
    /**
     * Create an Xhr instance
     * @param {object} opts - Options of request
     * @param {string} [opts.contentType = application/json] - The custom content type for request
     * @param {object=} opts.headers- Additional object to headers
     * @param {boolean=} opts.withCredentials - Transmit credentials
     * @param {boolean=} opts.json - The request must return JSON or not?
     */
    constructor(opts) {
        this.events = {
            READY_STATE_CHANGE: 'readystatechange',
            LOAD_START: 'loadstart',
            PROGRESS: 'progress',
            ABORT: 'abort',
            ERROR: 'error',
            LOAD: 'load',
            TIMEOUT: 'timeout',
            LOAD_END: 'loadend'
        };

        this.opts = opts;
    }

    /**
     * Send the XHR
     * @param {string} url - URL to request
     * @param {string} [method = GET] - REST method
     * @param {*?} data - Data which will need to send
     * @returns {Promise}
     */
    send(url, method, data) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            var m = method || 'GET';
            xhr.open(m, url);

            // Set headers
            xhr.setRequestHeader('Content-Type', this.opts.contentType || 'application/json');

            // Custom
            if (this.opts.headers) {
                for (var name in this.opts.headers) {
                    var value = this.opts.headers[name];
                    xhr.setRequestHeader(name, value);
                }
            }

            // Transmit credentials
            if (this.opts.withCredentials) xhr.withCredentials = true;
            data = data ? this.parseData(data) : null;

            xhr.addEventListener(this.events.LOAD, () => {
                // ==0 for files.
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
                    let responseText = '';
                    if (xhr.responseText) {
                        responseText = this.opts.json ? JSON.parse(xhr.responseText) : xhr.responseText;
                    }
                    resolve(responseText, xhr);
                } else {
                    reject(this.reject(xhr));
                }
            });

            // Handle basic events
            xhr.addEventListener(this.events.ABORT, () => {
                return reject(this.reject(xhr));
            });

            xhr.addEventListener(this.events.ERROR, () => {
                return reject(this.reject(xhr));
            });

            xhr.addEventListener(this.events.TIMEOUT, () => {
                return reject(this.reject(xhr));
            });

            data ? xhr.send(data) : xhr.send();
        });
    }

    /**
     * Reject handler
     * @param {object} xhr The request object
     * @returns {string} Text of response
     */
    reject(xhr) {
        let responseText = '';

        if (xhr.responseText) {
            responseText = this.opts.json ? JSON.parse(xhr.responseText) : xhr.responseText;
        }

        return responseText;
    }

    /**
     * Create query string
     * @param {*} data - Data
     * @returns {string} Query string
     */
    parseData(data) {
        // JSON
        if (this.opts.contentType == 'application/json')
            return JSON.stringify(data);

        // Query string
        var query = [];

        if (((typeof data).toLowerCase() == 'string') || (typeof data).toLowerCase() == 'number') {
            query.push(data);
        } else {
            for (var key in data) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }

        return query.join('&');
    }

    /**
     * GET Wrapper
     * @param {string} url - URL to request
     * @returns {Promise}
     */
    get(url) {
        return this.send(url);
    }

    /**
     * POST Wrapper
     * @param {string} url - URL to request
     * @param {*} data - Data
     * @returns {Promise}
     */
    post(url, data) {
        return this.send(url, 'POST', data);
    }

    /**
     * DELETE Wrapper
     * @param {string} url - URL to request
     * @returns {Promise}
     */
    delete(url) {
        return this.send(url, 'DELETE');
    }

    /**
     * PUT Wrapper
     * @param {string} url - URL to request
     * @param {*} data - Data
     * @returns {Promise}
     */
    put(url, data) {
        return this.send(url, 'PUT', data);
    }
}

module.exports = Xhr;