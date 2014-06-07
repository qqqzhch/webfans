module.exports = function(grunt) {
    grunt.initConfig({
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
        }


    });


    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', ['compass:dist', 'connect:server', 'watch']);
};