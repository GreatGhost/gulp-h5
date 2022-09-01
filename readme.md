
# gulp搭建h5模板
![](https://files.mdnice.com/user/17614/6bc1230b-fc19-4657-a728-2a82c572ec9a.png)


  日常开发web项目过程中，需要考虑css兼容、js兼容、图片压缩、代码格式化等让人头疼的问题。但是引用了gulp，将解决你遇到的这些痛点。
> gulp 将开发流程中让人痛苦或耗时的任务自动化，从而减少你所浪费的时间、创造更大价值。

下面，通过gulp和gulp系列插件，构建一个h5模板页，带你了解gulp。
### 项目运行
```
  // 拷贝代码
  git clone https://github.com/GreatGhost/gulp-h5.git
  // 安装依赖
  npm install
  // 运行gulp
  gulp 或者 gulp -f gulpfile.js(也可以是其它配置文件)
  ```
### 准备环境
  - node 版本14.15.14 32 位
  - gulp版本 gulp4


### gulp 处理pug文件
.pug文件 是基于Pug模板引擎。通过gulp-pug插件，可以将pug解析成html文件。pug可以将html拆分成各个组件、模板，从而实现组件化的思想；详细了解，点击下方链接👇<br>
[pug官方文档](https://www.pugjs.cn/api/getting-started.html)

[gulp-pug插件](https://www.npmjs.com/package/gulp-pug)


贴一段pug构建例子
```
  const choice = "2022-8-31h5模板";
const buildPath = "./dist";
const devPath = "./src/project";
// pug 构建
gulp.task("pug", () => {
  return gulp
    .src([path.resolve(devPath, choice, "pug/*.pug")])
    .pipe($.pug({ pretty: true }))
    .pipe(gulp.dest(path.resolve(buildPath, choice)));
});
```

### gulp 处理less文件
 gulp 处理过程less文件过程
   - gulp-less 转化less到css 
   - gulp-clean-css 压缩css
   - gulp-autoprefixer 添加css前缀
   - postcss-px-to-viewport 转化px 到 vw
   - gulp-postcss 预处理css工具

```
gulp.task("less", () => {
  const autoprefixerConfig = {
    overrideBrowserslist: ['last 2 versions',
    'Android >= 4.0',
    "iOS 7.1",
    "Chrome > 31",
    "ff > 28",
    "ie >= 8"]
  }
  return gulp
    .src([path.resolve(devPath, choice, "less/*.less")])
    .pipe($.less())
    .pipe($.postcss(processors))
    .pipe($.autoprefixer(autoprefixerConfig))
    .pipe($.cleanCss())
    .pipe(gulp.dest(path.resolve(buildPath, choice, "res/css")));
});
```
### gulp 处理js
js文件处理过程中涉及插件
- gulp-concat 合并文件
- gulp-uglify 格式化文件

```
  // 处理js
gulp.task("js",()=>{
  return gulp.src([path.resolve(devPath,choice,"js/libs/*.js")])
        .pipe($.plumber())
        .pipe($.concat("lib.js",{newLine:";"}))
        .pipe($.uglify({ie:8}))
        .pipe(gulp.dest(path.resolve(buildPath,choice,"res/js")))
});

```
### 处理图片
```
gulp.task('image', () => {
  return gulp.src([path.resolve(devPath, choice, 'images/**')])
    .pipe(gulp.dest(path.resolve(buildPath, choice, 'res/images')))
    .pipe($.connect.reload());
});
```
鉴于gulp-imagemin \gulp-tiny-png等系列插件 插件，图片压缩效果、压缩大小都不是很好。大家还是去熊猫压缩[https://tinypng.com/](https://tinypng.com/);

PS：如果有好的压缩方案，可以评论区留言
### 启动服务
```
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

```

### gulp常用插件介绍
- gulp-plumber 
> gulp-plumber这是一款防止因gulp插件的错误而导致管道中断，plumber可以阻止 gulp 插件发生错误导致进程退出并输出错误日志。

### 遇到问题记录下
1️⃣ gulp-connect的一个问题:connect.reload() is not working
问题排查如下：
 a.是否开启了多个项目，占用了gulp-connect
 
![](https://files.mdnice.com/user/17614/c6a082dc-dcc8-4ab1-a791-7b906e630f0b.png)

 b.watch 任务没有done
 
 ### 结尾
 本文只是记录下gulp构建方案，有什么不正确的地方，欢迎在issue或者评论区留言。如果写得还可以，多多点赞！！！
 
> 读一本好书，就是在和高尚的人谈话。 ——歌德

### 参考文献
  [gulp官网](https://www.gulpjs.com.cn/)
  
  [npmjs.com](npmjs.com)

