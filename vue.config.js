const path = require("path");
module.exports = {
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: false,
    publicPath: "./",
    configureWebpack: () => {
        return {
            devtool: "source-map",
            devServer: {
                // proxy: {},
                // public: "127.0.0.1:8901", // For docker host
                watchOptions: {
                    poll: true,
                    ignored: /(node_modules|dist|build|vendor|Docker|tests|backup|\.lock|\.git)/,
                },
                disableHostCheck: true,
                historyApiFallback: true,
            },
        };
    },
};
