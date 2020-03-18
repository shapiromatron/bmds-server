const path = require("path"),
    BundleTracker = require("webpack-bundle-tracker");

module.exports = {
    context: __dirname,

    entry: {
        main: ["./bmd/index"],
    },

    mode: "development",

    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: [
                            "@babel/plugin-syntax-dynamic-import",
                            ["@babel/plugin-proposal-class-properties", {loose: false}],
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
            },
        ],
    },

    output: {
        filename: "[name].[hash].js",
        chunkFilename: "[name].[hash].js",
        path: path.resolve("../bmds_server/static/bundles"),
        publicPath: "/static/bundles/",
    },

    plugins: [
        new BundleTracker({
            filename: "../webpack-stats.json",
        }),
    ],

    resolve: {
        alias: {
            bmd: path.join(__dirname, "bmd"),
        },
        modules: [path.join(__dirname, "bmd"), "node_modules"],
        extensions: [".js", ".css"],
    },
};
