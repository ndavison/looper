/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
        
        el: '#view-volume',
        
        events: {
            'input input': 'changed'
        },
                
        changed: function(ev) {
            this.app.dispatcher.trigger('change-all-volumes', this.getVolume());
        },
        
        getVolume: function() {
            return (this.$el.find('input[name=loopers-volume]').val() / 100);
        },
        
        initialize: function(options) {},
        
        render: function() {}
        
    });
   
    return View;
    
});
 