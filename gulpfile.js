var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sequence = require('gulp-sequence'),
	autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat'),
	rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector'),
	clean = require('gulp-clean'),
	bom = require('gulp-bom'),
	minifyHTML   = require('gulp-minify-html'); 
	

gulp.task('styles', function () {
  return gulp.src('./src/styles/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
	.pipe(gulp.dest('./dist/styles'))
	.pipe(rename({ suffix: '.min' }))
	.pipe(minifycss())
	.pipe(bom())
    .pipe(gulp.dest('./dist/styles'));
});
gulp.task('styles-module', function () {
	return gulp.src('./src/module/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
	.pipe(gulp.dest('./src/module'))
	//.pipe(rename({ suffix: '.min' }))
	.pipe(minifycss())
	.pipe(bom())
    .pipe(gulp.dest('./module'));
});
gulp.task('scripts', function () {
  return gulp.src('./src/scripts/**/*.js')
	.pipe(gulp.dest('./dist/scripts'))
	.pipe(jshint.reporter('default'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
	.pipe(bom())
	.pipe(gulp.dest('./dist/scripts'));
});
gulp.task('scripts-module', function () {
  return gulp.src('./src/module/**/*.js')
	.pipe(jshint.reporter('default'))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
	.pipe(bom())
	.pipe(gulp.dest('./module'));
});
gulp.task('concat',function(){
	 gulp.src('./src/components/**/*.js')
		.pipe(concat('components.js'))
		.pipe(bom())
		.pipe(gulp.dest('./dist/scripts'))
		.pipe(jshint.reporter('default'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(bom())
		.pipe(gulp.dest('./dist/scripts'));
	gulp.src('./src/components/**/*.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(concat('components.css'))
		.pipe(bom())
		.pipe(gulp.dest('./dist/styles'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(bom())
		.pipe(gulp.dest('./dist/styles'));
	return gulp.src(['./src/styles/reset.css','./dist/styles/global.css','./dist/styles/components.css'])
		.pipe(concat('package.css'))
		.pipe(bom())
		.pipe(gulp.dest('./dist/styles'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(bom())
		.pipe(gulp.dest('./dist/styles'));
})
gulp.task('concat-components-scripts',function(){
	return gulp.src('./src/components/**/*.js')
		.pipe(concat('components.js'))
		.pipe(bom())
		.pipe(gulp.dest('./dist/scripts'))
		.pipe(jshint.reporter('default'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(bom())
		.pipe(gulp.dest('./dist/scripts'));
})
gulp.task('concat-components-styles',function(){
	return gulp.src('./src/components/**/*.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(concat('components.css'))
		.pipe(bom())
		.pipe(gulp.dest('./dist/styles'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(bom())
		.pipe(gulp.dest('./dist/styles'));
})
gulp.task('concat-styles',function(){
	return gulp.src(['./src/styles/reset.css','./dist/styles/global.css','./dist/styles/components.css'])
		.pipe(concat('package.css'))
		.pipe(bom())
		.pipe(gulp.dest('./dist/styles'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(bom())
		.pipe(gulp.dest('./dist/styles'));
})
gulp.task('html', function() {
  return gulp.src('./src/html/**/*.html')
    .pipe(connect.reload());
});
gulp.task('server', function() {
  connect.server({
    livereload: true,
    port: 3000
  })
});

// 看手
gulp.task('watch', function() {
  // 看守所有.css档
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/module/**/*.scss', ['styles-module']);

  // 看守所有.js档
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/module/**/*.js', ['scripts-module']);

  // 看守所有.html档
  gulp.watch('src/html/**/*.html', ['html']);
  
  // 看守所有要合并的文件
  gulp.watch(['src/components/**/*.js','src/components/**/*.scss','src/styles/reset.css','dist/styles/global.css','dist/styles/components.css'], ['concat']);
});
gulp.task('dev', ['server','watch']);


//清除文件
gulp.task('clean',function(){
	return gulp.src(['dist/scripts/*.min.js','dist/styles/*.min.css','rev','module'])
		.pipe(clean());
})
//生成manifest文件
gulp.task('manifest-scripts',function(){
	return gulp.src('dist/scripts/**/*.min.js')
	.pipe(rev())
	.pipe(bom())
	.pipe(gulp.dest('dist/scripts'))
	.pipe(rev.manifest('rev/rev-manifest.json',{
		base: process.cwd()+'/rev',
		merge: true // merge with the existing manifest (if one exists)
	}))
	.pipe(gulp.dest('rev'))
});
gulp.task('manifest-styles',function(){	
	return gulp.src('dist/styles/**/*.min.css')
	.pipe(rev())
	.pipe(gulp.dest('dist/styles'))
	.pipe(rev.manifest('rev/rev-manifest.json',{
		base: process.cwd()+'/rev',
		merge: true // merge with the existing manifest (if one exists)
	}))
	.pipe(gulp.dest('rev'))
});

//替换html资源文件名
gulp.task('rev', function() {
   return gulp.src(['rev/*.json', 'src/module/**/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({
			replaceReved: true,
            dirReplacements: {
				'.css':'.min.css',
				'.js':'.min.js',
				'dist/scripts/':function(manifest_value){
					return 'dist/scripts/'+manifest_value;
				},
				'dist/styles/':function(manifest_value){
					return 'dist/styles/'+manifest_value;
				}
			}
		}))                           //- 执行文件内css名的替换
		//.pipe( minifyHTML({
                //empty:true,
                //spare:true
            //}) )
		.pipe(bom())
        .pipe(gulp.dest('module'));                     //- 替换后的文件输出的目录
});
/**module build
gulp.task('manifest-module-log-scripts',function(){
	return gulp.src('module/log/*.js')
	.pipe(rev())
	.pipe(bom())
	.pipe(gulp.dest('module/log'))
	.pipe(rev.manifest('rev/log/rev-manifest.json',{
		base: process.cwd()+'/rev/log',
		merge: true // merge with the existing manifest (if one exists)
	}))
	.pipe(gulp.dest('rev/log'))
});
gulp.task('manifest-module-log-styles',function(){	
	return gulp.src('module/log/*.css')
	.pipe(rev())
	.pipe(gulp.dest('module/log'))
	.pipe(rev.manifest('rev/log/rev-manifest.json',{
		base: process.cwd()+'/rev/log',
		merge: true // merge with the existing manifest (if one exists)
	}))
	.pipe(gulp.dest('rev/log'))
});
**/
//替换html资源文件名
gulp.task('module-log-rev', function() {
   return gulp.src(['rev/log/*.json', 'module/log/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({
			replaceReved: true,
            dirReplacements: {
				'.css':'.min.css',
				'.js':'.min.js',
				'src/module/log/':function(manifest_value){
					return 'module/log/'+manifest_value;
				}
			}
		}))                           //- 执行文件内css名的替换
		//.pipe( minifyHTML({
                //empty:true,
                //spare:true
            //}) )
		.pipe(bom())
        .pipe(gulp.dest('module/log'));                     //- 替换后的文件输出的目录
});
gulp.task('build', sequence('clean', ['styles','styles-module', 'scripts','scripts-module'],'concat-components-scripts','concat-components-styles','concat-styles', 'manifest-scripts', 'manifest-styles','rev','manifest-module-log-scripts','manifest-module-log-styles','module-log-rev'));