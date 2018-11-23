const path = require('path')
const DIST_DIR = path.join(__dirname, 'dist')

module.exports = {
    mode   : 'development',
    entry  : './demo/index.js',
    output : {
        filename : 'main.js',
        path     : DIST_DIR
    },
    devServer : {
        compress    : true,
        port        : 8080,
        contentBase : DIST_DIR
    },
    devtool : 'source-map'
}
