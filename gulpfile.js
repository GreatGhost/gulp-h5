const gulp = require("gulp");
const path = require("path");
const pxtoviewport = require("postcss-px-to-viewport");

const $ = require("gulp-load-plugins")();
const choice = "2022-8-31h5模板";
const buildPath = "./dist";
const devPath = "./src/project";
// pug 构建
gulp.task("pug", () => {
  return gulp
    .src([path.resolve(devPath, choice, "pug/*.pug")])
    .pipe($.pug({ pretty: true }))
    .pipe(gulp.dest(path.resolve(buildPath, choice)))
    .pipe($.connect.reload());
});
gulp.task("less", () => {
  // vw方案
  const processors = [
    pxtoviewport({
      viewportWidth: 750, // 设计稿宽
      unitPrecision: 6,
      viewportUnit: "vw",
    }),
  ];
  const autoprefixerConfig = {
    overrideBrowserslist: [
      "last 2 versions",
      "Android >= 4.0",
      "iOS 7.1",
      "Chrome > 31",
      "ff > 28",
      "ie >= 8",
    ],
  };
  return gulp
    .src([path.resolve(devPath, choice, "less/*.less")])
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.postcss(processors))
    .pipe($.autoprefixer(autoprefixerConfig))
    .pipe(
      $.cleanCss({
        compatibility: "ie8",
      })
    )
    .pipe(gulp.dest(path.resolve(buildPath, choice, "res/css")))
    .pipe($.connect.reload());
});

// 删除文件
gulp.task("clean", () => {
  return gulp
    .src(buildPath + "/" + choice, { allowEmpty: true })
    .pipe($.clean());
});

// 处理js
gulp.task("js",()=>{
  return gulp.src([path.resolve(devPath,choice,"js/libs/*.js")])
        .pipe($.plumber())
        .pipe($.concat("lib.js",{newLine:";"}))
        .pipe($.uglify({ie:8}))
        .pipe(gulp.dest(path.resolve(buildPath,choice,"res/js")))
        .pipe($.connect.reload())
});

// images

gulp.task('image', () => {
  return gulp.src([path.resolve(devPath, choice, 'images/**')])
    .pipe(gulp.dest(path.resolve(buildPath, choice, 'res/images')))
    .pipe($.connect.reload());
});

// 拷贝js
gulp.task('copyJS',()=>{
  return gulp.src([path.resolve(devPath,choice,"js/*.js"),path.resolve(devPath,choice,"js/scripts/*.js")])
        .pipe(gulp.dest(path.resolve(buildPath,choice,"res/js")))
})
// watch

gulp.task("watch",(done)=>{
  let _path = devPath + '/' + choice + '/';
  gulp.watch([_path+"pug/**/*.pug"],gulp.series('pug'))
  gulp.watch([_path+"less/**/*.less"],gulp.series('less'))
  gulp.watch([_path+"js/libs/*.js"],gulp.series('js'))
  gulp.watch([_path+"js/*.js",_path+"js/scripts/*.js"],gulp.series('copyJS'))
  gulp.watch([_path+"images/**"],gulp.series('image'))
  done();
})
// connect
gulp.task('connect', function (done) {
   $.connect.server({
    root: buildPath + '/' + choice,
    port: 9999,
    livereload: true,
    host: 'localhost'
  });
  done();
});


// 默认任务
gulp.task(
  "default",
  gulp.series("clean", gulp.parallel("pug", "less","js","copyJS"),gulp.series('watch','connect'))
  // gulp.parallel("connect", "watch")
);
