function middleware() {

    return {
        mwClientLogger : global.rootRequire('server/common/middleware/client_logger')
    };
}

module.exports = middleware();