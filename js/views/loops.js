/**
 *
 *
 *
 *
 */

define(['backbone', 'views/loopbutton'], function(Backbone, LoopButtonView) {
   
    var View = Backbone.View.extend({
        
        el: '#view-loops',
        
        addLoopButton: function(name, audioFile) {
            var button = new LoopButtonView({name: name, model: audioFile});
            var container = $('<div></div>').addClass('col-md-1 col-sm-2 col-xs-4').html(button.$el);
            this.$el.append(container);
        },
        
        initialize: function() {},
        
        render: function() {}
        
    });
   
    return View;
    
});
 