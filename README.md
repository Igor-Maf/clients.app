#### Requirements
+ nodejs
+ npm
+ bower

All other dependencies will installed in node_modules and bower_components directories

#### Install and start the app
`npm start`

#### Create xhr instance
```
var xhr = new Xhr(opts);

xhr.post('http://url.com', {
    data: 123
}).then(function(response) {
    // ...
}, function(err) {
    // ...
});
```

#### Options
+ withCredentials - Adds cookie and auth data to request.
+ contentType - content type header,
+ json - Handle response as JSON.