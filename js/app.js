/**
 *
 *
 *
 *
 */

define(['config', 'extensions', 'backbone', 'underscore', 'router', 'models/dropbox', 'views/alerts', 'views/navbar', 'views/menu', 'views/createform', 'views/findlooper', 'views/controls', 'views/loops', 'views/status'], function(Config, Extensions, Backbone, _, Router, Dropbox, AlertsView, NavBarView, MenuView, CreateFormView, FindLooperView, ControlsView, LoopsView, StatusView) {

    "use strict";
    
    var App = function() {
        
        this.config = new Config();
        this.views = {};
        this.models = {};
        this.mode = 'create';
        
        /**
         * A central event dispatcher.
         */
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
                        
            /**
             * The necessary views.
             */
            app.views.navbar = new NavBarView();
            app.views.menu = new MenuView();
            app.views.createform = new CreateFormView();
            app.views.findlooper = new FindLooperView();
            app.views.controls = new ControlsView();
            app.views.alerts = new AlertsView();
            app.views.loops = new LoopsView();
            app.views.status = new StatusView();
            
            /**
             * Router callbacks.
             */
            app.router = new Router();
            Backbone.history.start();            
            
            // authenticate to Dropbox without interaction, in case the user has cached credentials
            app.models.dropBox.auth({interactive: false}).then(function(success) {
                if (success) {
                    app.dispatcher.trigger('signed-in');
                    return app.models.dropBox.getAccountInfo();
                } else {
                    app.dispatcher.trigger('signed-out');
                    return null
                }
            }).then(function(accountInfo) {
                // set the default menu item
                app.views.menu.activeDefault();
                
                if (accountInfo) {
                    app.dispatcher.trigger('signed-in-user-info', accountInfo);
                }
            }).catch(function(error) {
                console.log(error);
            });
            
        };
    };
    
    return App;
});
