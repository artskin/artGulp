var gulp      = require('gulp');

var less      = require('gulp-less'),
	minifycss = require('gulp-minify-css'),    // CSS压缩
    uglify    = require('gulp-uglify'),        // js压缩
    concat    = require('gulp-concat'),        // 合并文件
    rename    = require('gulp-rename'),        // 重命名
    clean     = require('gulp-clean');         //清空文件夹
//var gutil   = require('gulp-util');

var rev          = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');

// less解析，合并，压缩，重命名
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions","Firefox >= 20","> 1%","ie 9","ie 8"] });

var config = {
    path: {
        less: [
            './less/ylb.less',
            './less/themes/ylb.ui.less'
        ],
        tmpl:[
            './src/tmpl/'
        ]
    }
}

gulp.task('less2css', function(){
	gulp.src('./src/less/pages.less')
        .pipe(less({
            plugins:[autoprefix]
        }))
        .pipe(rename({ suffix: '.min' }))
        //.pipe(gulp.dest('./src/style/'))
        .pipe(less({
            plugins:[cleancss]
        }))
        .pipe(rev())
        .pipe(gulp.dest('./dist/style/'))
        
        .pipe(rev.manifest())
        .pipe(gulp.dest('./src/dev/css/'))

	//gulp.src('./src/less/*.less')
    //    .pipe(less())
    //    .pipe(gulp.dest('./src/style/css/'))
});

// 合并，压缩js文件
gulp.task('javascripts', function() {
    gulp.src('./src/js/modules/*.js')
        .pipe(concat('ylb.js'))
        .pipe(gulp.dest('./src/js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./src/dev/js'))
});

gulp.task('clean',function(){
    gulp.src(['./dist/demo','./dist/js','./dist/style'],{read: false})
    .pipe(clean());
})

    


gulp.task('rev', function(){
    gulp.src(['./src/dev/*/*.json','./src/demo/app.html'])
        .pipe(revCollector({
            replaceReved:true
        }))
        .pipe(gulp.dest('./dist/demo'))

    //gulp.src('./src/less/*.less')
    //    .pipe(less())
    //    .pipe(gulp.dest('./src/style/css/'))
});

// 定义develop任务在日常开发中使用
gulp.task('develop',function(){
  //gulp.run('buildlib','build-less','javascripts','stylesheets');
  gulp.run('clean','less2css','javascripts','rev');

  gulp.watch('./src/less/*.less', ['less2css']);
});

gulp.task('default', function(){
    gulp.run('develop');
});