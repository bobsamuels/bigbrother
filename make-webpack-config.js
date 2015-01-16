var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = function(options){

    var plugins = [
        new webpack.optimize.CommonsChunkPlugin('shared', 'shared.js'),
        new ExtractTextPlugin("../css/[name].css")
    ];

    if(options.minimize){
        plugins.push(new webpack.optimize.DedupePlugin());
        plugins.push(new webpack.optimize.UglifyJsPlugin());
    }

    return {
        entry: {
            app: ['./js/components/app.jsx'],
            common:['./js/common/actions.js', './js/common/tagsStore.js', './js/common/dataStore.js', './js/common/utils.js', './js/common/d3Chart.js']
        },
        output: {
            path: './build',
            filename: "bundle.js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
            chunkFilename: (options.release ? "[id].js" : "[name].js") + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
            sourceMapFilename: "debugging/[file].map"
        },
        cache: options.cache,
        debug: options.debug,
        devtool: options.devtool,

        stats: {
            colors: true,
            reasons: true
        },
        resolve: {
            root: __dirname,
            alias:{
                'common':'js/common',
                'components':'js/components',
                'less':'less'
            }
        },
        node:{
            net:"empty",
            tls:"empty",
            fs:"empty",
            dgram:"empty",
            dns: "empty"
        },
        module: {
            loaders: [
                {test: /\.css/, loader: "style-loader!css-loader"},
                {test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")},
                {test: /\.jsx$/, loader: "jsx-loader?harmony"},
                {test: /\.png/, loader: "url-loader?limit=100000&mimetype=image/png"},
                {test: /\.gif/, loader: "url-loader?limit=100000&mimetype=image/gif"},
                {test: /\.jpg/, loader: "file-loader"}
            ]
        },
        plugins: plugins
    }
};