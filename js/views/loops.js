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
            view.getTemplate('/looper/views/playloop.html', {loopId: loop.get('loopId'), name: loop.get('name'), enabled: loop.getAudioProperties().audioData ? true : false}, function(res) {
                view.show(res, view.$el, true);
            });
        },
        
        enableLoopButton: function(loop) {
            var view = this;
            var loopId = loop.get('loopId');
            if (loopId) {
                if (view.$el.find('button[data-loopid=' + loopId + ']').length > 0) {
                    // the button is available, so remove its disabled attribute
                    var el = view.$el.find('button[data-loopid=' + loopId + ']');
                    el.removeAttr('disabled');
                } else {
                    
                }
            }
        },
        
        playLoop: function(ev) {
            ev.preventDefault();
            var target = ev.currentTarget;
            var loopId = $(target).attr('data-loopid');
            var loop = this.model.findWhere({loopId: loopId});
            if (loop) {
                loop.playLoop();
            }
        },
                
        initialize: function() {
            this.app.dispatcher.on('loop-loaded', this.enableLoopButton, this);
            this.app.dispatcher.on('loop-added', this.addLoopButton, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 