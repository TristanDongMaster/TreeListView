var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    size = require('gulp-size'),


    //css
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),

    concat = require('gulp-concat'),
    // //js
    uglify = require('gulp-uglify'),

    pug = require('gulp-pug'),

    image = require('gulp-image'),

    del = require('del'),
    md5 = require("md5"),
    exec = require('child_process').exec,
    pkg = require('./package.json'),
    zip = require('gulp-zip'),
    replace = require('gulp-replace');
      var postcss    = require('gulp-postcss');

process.setMaxListeners(0);

var version = 'grcredit-h5' + pkg.version
var dev_version = 'grcredit-h5/' + md5(version).substring(0, 10)



gulp.task('style', function() {
    styleLess('./www/less/*.less', './build/' + dev_version + '/css')
})


gulp.task('image', function() {
    processEnv()
    if (process.env.NODE_ENV === 'production') {
        gulp.src('./www/img/**/*.*')
            .pipe(image())
            .pipe(gulp.dest('./build/' + dev_version + '/img'))
    } else {
        gulp.src('./www/img/**/*.*')
            .pipe(gulp.dest('./build/' + dev_version + '/img'))
    }
});

gulp.task('concat', function() {
    return gulp.src(['./www/public/zepto.min.js', './www/public/hercules/hercules.2.js', './www/public/vera/vera-3.0.js'])
        .pipe(uglify())
        .pipe(concat('zepto.hercules.vera.js'), {
            newLine: ';'
        })
        .pipe(gulp.dest('./www/public/grcredit-h5/v1/'));
});

gulp.task('uglify', function() {
    return gulp.src(['./www/public/swipe.js', './www/public/hercules/hercules.1.js', './www/public/vera/vera-3.0.js'])
        .pipe(uglify())
        //.pipe(rename('swipe.min.js'))
        .pipe(gulp.dest('./www/public/grcredit-h5/v1/'));
});

gulp.task('html', function() {
    var isDev = process.env.NODE_ENV == 'development'
    var staticDomain = isDev ? '/' : '//grcredit.vipstatic.com/'
    var assetsPath = staticDomain + dev_version
    var publicPath = staticDomain + 'public'
    return gulp.src('./www/pug/views/**/*.pug')
        .pipe(plumber({
            errorHandler: errrHandler
        }))
        .pipe(pug({
            pretty: true,//isDev ? true : false,
            locals: {
                isDev: isDev,
                devVersion: dev_version,
                staticDomain: staticDomain,
                assetsPath: assetsPath,
                publicPath: publicPath
            }
        }))
        .pipe(gulp.dest('./build/html'));
});

gulp.task('dev', function() {
    process.env.NODE_ENV = 'development'
    build()
    var timeout = setTimeout(function() {
        // exe('node server.js')
        console.log(gutil.colors.green('ready for dev watching!!'))
        clearInterval(interval)
        clearTimeout(timeout)
    }, 5000)
    var interval = setInterval(function() {
        console.log(gutil.colors.green('waiting for preparing...'))
    }, 1000)
});


gulp.task('build', function() {
    process.env.NODE_ENV = 'production'
    build()
    var timeout = setTimeout(function() {
        console.log(gutil.colors.green('build:other assets builded'))
        exe('webpack -p', function() {
            console.log(gutil.colors.green('build:js builded'))
            copy('./dist/*', './build/' + dev_version + '/js')
            console.log(gutil.colors.green('build:js copyed'))
            console.log(gutil.colors.green('build:success'))
        })

        clearInterval(interval)
        clearTimeout(timeout)
    }, 10000)
     return
    var interval = setInterval(function() {
        console.log(gutil.colors.green('waiting for build...'))
    }, 1000)

    var zipinterval = setInterval(function() {
        console.log('********release********** : waiting for release zip...')
    }, 3000)

    var ziptimeout = setTimeout(function() {
        gulp.src(['./build/html/**/**'])
            .pipe(zip('html.zip'))
            .pipe(gulp.dest('./build'));
        clearInterval(zipinterval)
        clearTimeout(ziptimeout)
    }, 30000)
})

gulp.task('watch', function() {
    gulp.watch(['./www/less/**/*.*'], ['style']);
    gulp.watch(['./www/pug/**/*.*'], ['html']);
})

gulp.task('default', ['dev', 'watch']);


function exe(cmd, fn) {
    exec(cmd, function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
        if (fn) {
            fn()
        }
    });
}

function styleLess(src, dest) {
    var isDev = process.env.NODE_ENV == 'development'
    var staticDomain = isDev ? '/' : '//grcredit.vipstatic.com/'
    var assetsPath = staticDomain + dev_version
    var publicPath = staticDomain + 'public'
    processEnv()
    if (process.env.NODE_ENV === 'production') {
        gulp.src(src)
            .pipe(plumber({
                errorHandler: errrHandler
            }))
            .pipe(less({
                errLogToConsole: true
            }))
            .pipe(replace('${assetsPath}', assetsPath))
            .pipe(autoprefixer({
               browsers: ['> 5%', 'iOS 7','Android >= 4.0'],
                cascade: true,
                remove: false
            }))
            .pipe(minifyCss({
                keepSpecialComments: 0
            }))
             .pipe(postcss([require('postcss-flexbugs-fixes')]))
            .pipe(size())
            .pipe(gulp.dest(dest));
    } else {
        gulp.src(src)
            .pipe(plumber({
                errorHandler: errrHandler
            }))
            .pipe(less({
                errLogToConsole: true
            }))
            .pipe(replace('${assetsPath}', assetsPath))
            .pipe(autoprefixer({
                browsers: ['> 5%', 'iOS 7','Android >= 4.0'],
                cascade: true,
                remove: false
            }))
             .pipe(postcss([require('postcss-flexbugs-fixes')]))
            .pipe(gulp.dest(dest));
    }
}

function copy(src, dest) {
    gulp.src(src)
        .pipe(gulp.dest(dest));
}

function errrHandler(e) {
    gutil.beep();
    gutil.log('===================', gutil.colors.cyan(e));
}

function build() {
    del(['./build/']).then(paths => {
        console.log(gutil.colors.green('del...:' + paths.join('\n')))
        gulp.start('html')
        gulp.start('style')
        copy('./www/public/**/*.*', './build/public')
        copy('./www/svg/**/*.*', './build/' + dev_version + '/svg')
        gulp.start('image')
    })
}



function script(src, dest) {
    processEnv()
    if (process.env.NODE_ENV === 'production') {
        gulp.src(src)
            .pipe(uglify()) //压缩
            .pipe(gulp.dest(dest))
    } else {
        gulp.src(src)
            .pipe(gulp.dest(dest))
    }
}



function processEnv() {
    console.log(gutil.colors.green('process.env.NODE_ENV is: ' + process.env.NODE_ENV))
}