
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        requirejs: {
            compile: {
                options: {
                    baseUrl: "js/",
                    name: "main",
                    mainConfigFile: 'js/main.js',
                    out: 'js/main-build.js'
                }
            }
        },
        
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /main\.js/,
                            replacement: 'main-build.js'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['index.html'], dest: ''}
                ]
            }
        }
        
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-replace');
    
    grunt.registerTask('default', []);
    grunt.registerTask('prod', ['requirejs', 'replace']);

};
