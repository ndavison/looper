/**
 *
 *
 *
 *
 */

requirejs.config({
    baseUrl: '/looper/js',
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'backbone': '../bower_components/backbone/backbone-min',
        'underscore': '../bower_components/underscore/underscore-min',
        'rsvp': '../bower_components/rsvp/rsvp.min',
        'dropbox': '../bower_components/dropbox/lib/dropbox.min',
        'dropboxdropins': 'https://www.dropbox.com/static/api/2/dropins',
        'Howler': '../bower_components/howler/howler.min'
    },
    shim: {
        'backbone': {
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'dropbox': {
            exports: 'Dropbox'
        },
        'dropboxdropins': {
            exports: 'Dropbox'
        },
        'Howler': {
            exports: 'Howl'
        }
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});
 
requirejs(['app'], function(App) {
    
    var app = new App();
    app.start();
    
});
