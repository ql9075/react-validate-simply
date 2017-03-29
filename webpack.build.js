var packageInfo = require('./package.json'),
  webpackConfig = require('./webpack.config.js'),
    copyWebpackPlugin = require('copy-webpack-plugin'),
    webpack = require('webpack'),
  zipper = require('zip-local'),
  del = require('del')
;

//生成以当前时间开始的文件名
function renderFileName(){
    function CurentTime(){
       var date=new Date(),
        year=date.getFullYear(),
        month=date.getMonth()+1,
        day=date.getDate(),
        hour=date.getHours(),
        minutes=date.getMinutes(),
        str="";
        if(month<10){
            month="0"+month;
        }
        if(day<10){
            day="0"+day;
        }
        if(hour<10){
            hour="0"+hour;
        }
        if(minutes<10){
            minutes="0"+minutes;
        }
        return year+""+month+""+day+"T"+hour+minutes;
    }
    return  packageInfo.name + "-" + CurentTime();
}


var name = renderFileName();

del(['./output/*']).then(paths => {
      console.log('Deleted files and folders:\n', paths.join('\n'));
});




webpackConfig.output.path = './output/static/' + name;

webpackConfig.plugins = webpackConfig.plugins || [] ;
webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        output: {
            comments: false
        }
    }),
    new copyWebpackPlugin([{
        from: __dirname + '/app/pages/',
        to: __dirname + '/output/static/'+name+'/pages/'
    }])
]);


webpack( webpackConfig, function(err, stats){
  if (err) { 
    console.log('webpack:error: '+err)
    return;
  }

    console.log('webpack:build: '+ stats.toString({
      modules:true,
        chunks: true, // Makes the build much quieter
        colors: true
    }));

  zipper.sync.zip("./output/static").compress().save('./output/' + name + ".zip");
});