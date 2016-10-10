define(function(require, exports, module) {
    var isDebug = true;

    module.exports = {
        debug: isDebug,
        dataType: isDebug ? 'json' : 'jsonp',
        contentType: "application/json; charset=utf-8"

    }
})