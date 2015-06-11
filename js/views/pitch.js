/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
        
        el: '#view-pitch',
        
        events: {
            'input input': 'changed'
        },
                
        changed: function(ev) {
            this.app.dispatcher.trigger('change-pitch', this.getPitch());
        },
        
        getPitch: function() {
            return (this.$el.find('input[name=loopers-pitch]').val() / 100);
        },
        
        initialize: function() {},
        
        render: function() {}
        
    });
   
    return View;
    
});
