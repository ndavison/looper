/**
 *
 *
 *
 *
 */

 
define(['extensions', 'backbone', 'underscore', 'views/alerts', 'views/navbar', 'views/createform', 'views/volume', 'views/pitch', 'views/loops'], function(Extensions, Backbone, _, AlertsView, NavBarView, CreateFormView, VolumeView, PitchView, LoopsView) {
    
    var App = function() {

        this.views = {};
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
             * The necessary views.
             */
            app.views.navbar = new NavBarView();
            app.views.createForm = new CreateFormView();
            app.views.volume = new VolumeView();
            app.views.pitch = new PitchView();
            app.views.alerts = new AlertsView();
            app.views.loops = new LoopsView();
            
        };
    };
    
    return App;
});
