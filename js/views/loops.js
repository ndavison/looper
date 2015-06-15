/**
 *
 *
 *
 *
 */
 
"use strict"

define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
        
        el: '#view-loops',
        
        events: {
            'click button': 'playLoop',
            'touchstart button': 'playLoop'
        },
        
        addLoopButton: function(loop) {
            var view = this;
            view.getTemplate('/looper/views/playloop.html', {loopId: loop.get('loopId'), name: loop.get('name')}, function(res) {
                view.show(res, view.$el, true);
            });
        },
        
        playLoop: function(ev) {
            ev.preventDefault();
            var target = ev.currentTarget;
            var loopId = $(target).attr('data-loopid');
            this.app.dispatcher.trigger('play-loop', loopId);
        },
                
        initialize: function() {
            this.app.dispatcher.on('loop-added', this.addLoopButton, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 