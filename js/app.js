/**
 *
 *
 *
 *
 */

"use strict"
 
define(['extensions', 'backbone', 'underscore', 'models/dropbox', 'models/audiofiles', 'views/alerts', 'views/navbar', 'views/createform', 'views/controls', 'views/loops', 'views/looputilitybuttons'], function(Extensions, Backbone, _, Dropbox, AudioFiles, AlertsView, NavBarView, CreateFormView, ControlsView, LoopsView, LoopUtilityButtonsView) {
    
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
            app.models.dropBox = new Dropbox({key: 'zr16qymzqg21hzf', receiverURL: 'https://' + window.location.hostname + '/looper/dropbox-receiver.html'});
            
            /**
             * The necessary views.
             */
            app.views.navbar = new NavBarView({model: app.models.dropBox});
            app.views.createForm = new CreateFormView();
            app.views.controls = new ControlsView();
            app.views.alerts = new AlertsView();
            app.views.loops = new LoopsView({model: new AudioFiles()});
            app.views.looputilitybuttons = new LoopUtilityButtonsView();
            
            // authenticate to Dropbox without interaction, in case the user has cached credentials
            app.models.dropBox.auth({interactive: false});
        };
    };
    
    return App;
});
