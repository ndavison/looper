/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
                       
        model: null,
        
        attributes: {
            'class': 'col-md-1 col-sm-2 col-xs-4'
        },
        
        events: {
            'click': 'clicked'
        },
                
        clicked: function(ev) {
            this.app.dispatcher.trigger('saving-loops', this.model);
        },
        
        initialize: function() {},
        
        render: function() {}
        
    });
   
    return View;
    
});
 