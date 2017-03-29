// nodejs 中的path模块
var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractPlugin = require('extract-text-webpack-plugin')
  ;
var env = process.env.NODE_ENV || 'dev' ;

const hotDevServer = 'webpack/hot/dev-server';
// https://github.com/webpack/webpack-dev-server
const webpackHotMiddleware = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';


var webpackConfig =  {
    // 入口文件，path.resolve()方法，可以结合我们给定的两个参数最后生成绝对路径，最终指向的就是我们的index.js文件
    // devtool: env == 'dev' ? 'inline-source-map' : false ,
    entry:{
        app: [hotDevServer, webpackHotMiddleware, './examples/app.js'],
    },
    // 输出配置
    output: {
        path: '/',
        publicPath: '/',
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[id].[chunkhash].js'
    }
    ,
    resolve: {
        extensions: ['', '.js','.jsx', '.json', '.scss']
    }
    ,
    module: {
        loaders: [
            {   test: /\.(css|scss)$/, 
                loader: ExtractPlugin.extract(['css', 'sass'])
            },          
            {   test: /\.js$/, 
                exclude: /node_modules/,
                loader: 'react-hot!jsx-loader?harmony',
                loader: 'babel',
                query: {
                    presets: ['es2015','react','stage-1','babel-polyfill']
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]'
            }
        ]
    },
    
    plugins:[
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new ExtractPlugin('css/[name].css'), //
        new webpack.DefinePlugin({
           CONFIG:{
            ENV: JSON.stringify(env)
           },
           "process.env": { 
             NODE_ENV: JSON.stringify(env)
           }
        }),
        new HtmlWebpackPlugin({
            filename:'app.html',
            template:path.resolve(__dirname,'examples/app.html'),
            chunks: ['app'],
            inject:true
        })
    ]

}



module.exports = webpackConfig;