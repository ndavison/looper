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
        
        addLoopButtons: function(loops) {
            var view = this;
            var loop;
            for (var i = 0; i < loops.length; i++) {
                loop = loops[i];
                view.getTemplate('/looper/views/playloop.html', {loopId: loop.get('loopId'), name: loop.get('name'), enabled: loop.getAudioProperties().audioData ? true : false}, function(res) {
                    view.show(res, view.$el, true);
                });
            }
        },
        
        enableLoopButton: function(loop) {
            var view = this;
            var loopId = loop.get('loopId');
            if (loopId && view.$el.find('button[data-loopid=' + loopId + ']').length > 0) {
                var el = view.$el.find('button[data-loopid=' + loopId + ']');
                el.removeAttr('disabled');
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
            this.app.dispatcher.on('loops-added', this.addLoopButtons, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 