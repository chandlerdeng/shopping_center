define(function(require, exports, module) {
    var isDebug = false;

    module.exports = {
        debug: isDebug,
        dataType: isDebug ? 'json' : 'jsonp',
        contentType: "application/json; charset=utf-8",
        hash: Date.now()
    }
})