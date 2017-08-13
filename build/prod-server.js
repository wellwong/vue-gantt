var express = require('express')
var webpack = require('webpack')
var config = require('../config/index')
const opn = require('opn')

var webpackConfig = require('./webpack.prod.conf')

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

app.use(devMiddleware)
app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port
var autoOpenBrowser = config.build.autoOpenBrowser
var uri = 'http://localhost:' + port

module.exports = app.listen(port, (err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at ' + uri)

    if (autoOpenBrowser) {
        opn(uri)
    }
})
