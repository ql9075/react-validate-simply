var express = require('express'),
    webpack = require('webpack'),
    config = require('./webpack.config.dev.js'),
    open = require("open")
;


var app = express()

//调用webpack并传入配置
var compiler = webpack(config)

//使用中间件
var devMiddleware = require('webpack-dev-middleware')(compiler,{
    publicPath:config.output.publicPath,
    // hot: true,
    // inline:true,
 //    historyApiFallback: false,
 //    progress: true,
    stats:{
        colors:true,
        chunks:false
    }
})


// 使用 webpack-hot-middleware 中间件
var hotMiddleware = require('webpack-hot-middleware')(compiler) ;

//注册中间件
app.use(devMiddleware)
// 注册中间件
app.use(hotMiddleware)


//router(app);




//监听7777端口，开起服务器
app.listen(7777,function(err){
    if(err){
        console.log(err)
        return;
    }

    open('http://localhost:7777/app.html');

    console.log('listen 7777')
});
