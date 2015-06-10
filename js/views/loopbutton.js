/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
        
        tagName: 'button',
        
        name: 'loop',
        
        model: null,
        
        events: {
            'click': 'clicked'
        },
                
        clicked: function(ev) {
            this.app.dispatcher.trigger('stop-all-loops');
            this.model.playLoop();
        },
        
        initialize: function(options) {
            this.name = options.name || this.name;
            this.model = options.model || this.model;
            this.render();
        },
        
        render: function() {
            this.$el.addClass('btn btn-default').html(this.name);
        }
        
    });
   
    return View;
    
});
 