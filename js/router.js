/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
    
    var Router = Backbone.Router.extend({
        
        routes: {
            'looper/:id': 'loadLooper'
        },
        
        loadLooper: function(id) {
            this.app.views.loops.loadLooperFromId(id);
            this.app.dispatcher.trigger('looper-routed');
        },
        
        navigateToLooper: function(looper) {
            if (looper.get('_id')) {
                var route = 'looper/' + looper.get('_id');
                this.navigate(route);
            }
        },
        
        initialize: function() {
            this.app.dispatcher.on('looper-loaded', this.navigateToLooper, this);
            this.app.dispatcher.on('looper-saved', this.navigateToLooper, this);
        }
        
    });
    
    return Router;
    
});
