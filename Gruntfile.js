
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
            prod: {
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
        },
        
        shell: {
            npminstall: {
                command: 'npm install'
            },
            bowerinstall: {
                command: 'bower install'
            },
            dropboxinstall: {
                command: 'cd bower_components/dropbox && npm install'
            }
        }
        
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');
    
    grunt.registerTask('default', []);
    grunt.registerTask('prod', ['requirejs', 'replace:prod', 'shell:npminstall', 'shell:bowerinstall', 'shell:dropboxinstall']);

};
