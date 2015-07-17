
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
        }
        
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.registerTask('default', ['requirejs']);

};
