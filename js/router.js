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
        },
        
        navigateToLooper: function(looper) {
            if (looper.get('_id')) {
                this.navigate('looper/' + looper.get('_id'));
            }
        },
        
        initialize: function() {
            this.app.dispatcher.on('looper-loaded', this.navigateToLooper, this);
            this.app.dispatcher.on('looper-saved', this.navigateToLooper, this);
        }
        
    });
    
    return Router;
    
});
