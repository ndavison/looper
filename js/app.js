/**
 *
 *
 *
 *
 */

"use strict"
 
define(['config', 'extensions', 'backbone', 'underscore', 'models/dropbox', 'models/loops', 'views/alerts', 'views/navbar', 'views/createform', 'views/controls', 'views/loops', 'views/status'], function(Config, Extensions, Backbone, _, Dropbox, Loops, AlertsView, NavBarView, CreateFormView, ControlsView, LoopsView, StatusView) {
    
    var App = function() {
        
        this.config = Config;
        this.views = {};
        this.models = {};
        this.dispatcher = _.clone(Backbone.Events);
        this.dispatcher.on('all', function(eventName) {
            console.log(eventName + ' triggered');
        });
        
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
            app.models.dropBox = new Dropbox({key: app.config.dropboxAPIKey, receiverURL: app.config.oAuthReceiverURL});
            
            // proxy all Dropbox model events to the app event dispatcher, as dropbox:{event}.
            app.dispatcher.listenTo(app.models.dropBox, 'all', function(event, args) {
                this.trigger('dropbox:' + event, args);
            });
            
            /**
             * The necessary views.
             */
            app.views.navbar = new NavBarView({model: app.models.dropBox});
            app.views.createForm = new CreateFormView({attributes: {dropboxDropinKey: app.config.dropboxDropinKey}});
            app.views.controls = new ControlsView();
            app.views.alerts = new AlertsView();
            app.views.loops = new LoopsView({model: new Loops()});
            app.views.status = new StatusView();
            
            // authenticate to Dropbox without interaction, in case the user has cached credentials
            app.models.dropBox.auth({interactive: false});
        };
    };
    
    return App;
});
