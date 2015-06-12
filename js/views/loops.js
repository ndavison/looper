/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
        
        el: '#view-loops',
        
        events: {
            'click button': 'playLoop'
        },
        
        addLoopButton: function(name, loopId) {
            var view = this;
            view.getTemplate('/looper/views/playloop.html', {name: name, loopId: loopId}, function(res) {
                view.show(res, view.$el, true);
            });
        },
        
        playLoop: function(ev) {
            ev.preventDefault();
            var target = ev.currentTarget;
            this.app.dispatcher.trigger('play-loop', $(target).attr('data-loopid'));
        },
                
        initialize: function() {
            this.app.dispatcher.on('loop-added', this.addLoopButton, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 