/**
 *
 *
 *
 *
 */

"use strict"
 
define(['extensions', 'backbone', 'underscore', 'models/dropbox', 'views/alerts', 'views/navbar', 'views/createform', 'views/volume', 'views/pitch', 'views/loops'], function(Extensions, Backbone, _, Dropbox, AlertsView, NavBarView, CreateFormView, VolumeView, PitchView, LoopsView) {
    
    var App = function() {

        this.views = {};
        this.models = {};
        this.dispatcher = _.clone(Backbone.Events);
        
        /**
         * The app start.
         */
        this.start = function() {
            var app = this;
            var extensions = new Extensions();
            
            /**
             * Apply extensions.
             */
            extensions.backbone(app);
            
            /**
             * The necessary models.
             */
            app.models.dropBox = new Dropbox({key: 'zr16qymzqg21hzf', receiverURL: 'https://'+window.location.hostname+'/looper/dropbox-receiver.html'});
            
            /**
             * The necessary views.
             */
            app.views.navbar = new NavBarView({model: app.models.dropBox});
            app.views.createForm = new CreateFormView();
            app.views.volume = new VolumeView();
            app.views.pitch = new PitchView();
            app.views.alerts = new AlertsView();
            app.views.loops = new LoopsView();
            
        };
    };
    
    return App;
});
