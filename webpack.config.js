//var webpack = require("webpack");
//
//module.exports = {
//    entry:{
//        app: './js/components.jsx.js',
//        vendor: ["react", "react-router", "reflux"]
//    },
//    output:{
//        filename: './dist/bundle.js'
//    },
//    plugins:[
//        new webpack.optimize.CommonsChunkPlugin(
//            /* chunkName=*/"vendor",
//            /* filename= */"vendor.bundle.js"
//        )
//    ]
//};

module.exports = require("./make-webpack-config")({

});
