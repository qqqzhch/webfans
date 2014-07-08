module.exports = function(grunt) {
    // r.js 打包 准备
    var files = grunt.file.expand('js/app/*/main.js'); //读取要打包的js入口 一般都为 main的js
    var requirejsOptions = {}; //用来存储 打包配置的对象
    //遍历文件
    files.forEach(function(file) {
        var filenamelist = file.split('/');
        var num = filenamelist.length;
        var filename = filenamelist[num - 2]; //获取目录名称，因为这里的文件名都是main的js
        requirejsOptions[filename] = {
            options: {
                baseUrl: "js/",
                paths: {
                    "text": 'lib/text',
                    "jquery": 'lib/jquery',
                    "backbone": 'lib/backbone',
                    "underscore": 'lib/underscore',
                    "Highcharts": 'lib/highcharts/highcharts',
                    "select2": 'lib/select2/select2',
                    "moment": 'lib/moment',
                    "jquery-ui": 'lib/jquery-ui/jquery-ui',
                    "jquery.cookie": 'lib/jquery.cookie',
                    "validate": 'lib/jquery.validate',
                    "metadata": 'lib/jquery.metadata',
                    "jsplumb": "lib/jquery.jsPlumb",
                    "qtip": 'lib/qtip/jquery.qtip',
                    "nicescroll": "lib/jquery.nicescroll",
                    "Htheme": 'lib/highcharts/theme',
                    'jquery.mousewheel': 'lib/jquery.mousewheel'
                },
                optimizeAllPluginResources: true,
                name: 'app/' + filename + '/main',
                out: 'js/appbuild/' + filename + '/main.js'
            }
        };
    });
    //


    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        // requirejs: requirejsOptions
        connect: {
            //这里为插件子刷新方式
            options: {
                port: 9000,
                hostname: 'localhost', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
                livereload: 35729 //声明给 watch 监听的端口
            },
            server: {
                options: {
                    open: true, //自动打开网页 http://
                    base: [
                        '.' //主目录
                    ]
                }
            }

        },
        watch: {
            sass: {
                files: ['sass/**/*.{scss,sass}', 'sass/_partials/**/*.{scss,sass}'],
                tasks: ['compass:dist']
            },
            livereload: {
                options: {
                    livereload: '<%=connect.options.livereload%>' //监听前面声明的端口  35729
                },
                files: [ //下面文件的改变就会实时刷新网页
                    'app/*.html',
                    'stylesheets/{,*/}*.css',
                    'javascripts/{,*/}*.js',
                    'images/{,*/}*.{png,jpg}'

                ]
            }
        },

        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        jst: {

            options: {
                amd: true, // define()的方法包裹生成的内容
                namespace: false,
                // prettify: true, // 生成的内容在一行
                templateSettings: {
                    evaluate: /{%([\s\S]+?)%}/g,
                    interpolate: /{{([\s\S]+?)}}/g,
                    escape: /{%-([\s\S]+?)%}/g
                }
            },
            // files: {
            //     src: 'js/app/*/tpl/*.html',
            //     dest: 'js/app/$1/tpljs/$2.js'
            // }
            files: {
                expand: true, // 开启构建动态文件对象
                cwd: 'js/app/', // 模板目录（源文件）
                src: ['**/*.html'], // 能匹配到模板的二级目录
                dest: 'js/app/', // 目标文件目录
                rename: function(dest, src) {
                    var path = require('path');
                    var filename = path.basename(src);
                    var dirname = path.dirname(src);
                    dirname = dirname.replace('tpl', 'tpljs')
                    var finalPath = path.resolve(dest, dirname, 'js', filename);

                    console.log(dirname);
                    console.log(finalPath);
                    return finalPath;
                },
                ext: '.js' // 目标文件的后缀名
            }


        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: false,
                eqnull: true,
                browser: true,
                es3: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                //quotmark: true,
                undef: true,
                strict: true,
                maxdepth: 3,
                maxstatements: 50,
                maxlen: 255,
                globals: {
                    jQuery: true,
                    $: true,
                    require: true,
                    define: true,
                    Blueware: true,
                    _: true,
                    Backbone: true,
                    ATM: true,
                    console: true,
                },
            },
            files: {
                expand: true, // 开启构建动态文件对象
                cwd: 'js/app/', // 模板目录（源文件）
                src: ['*/*.js'], // 能匹配到模板的二级目录

            }
        }


    });


    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', ['compass:dist', 'connect:server', 'watch']);
};