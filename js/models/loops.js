/**
 *
 *
 *
 *
 */

"use strict"
 
define(['backbone', 'models/loop'], function(Backbone, Loop) {
    
    var Collection = Backbone.Collection.extend({
        
        model: Loop,
        
        context: null,
                
        stopAll: function() {
            this.invoke('stopLoop');
        },
        
        playLoop: function(loopId) {
            var loop = this.findWhere({loopId: loopId});
            if (loop && typeof loop.playLoop == 'function') {
                loop.playLoop();
            }
        },
        
        changeVolumes: function(level) {
            this.invoke('setVolume', level);
        },
        
        changePitches: function(level) {
            this.invoke('setPitch', level);
        },
        
        saveLoops: function() {
            var model = this;
            model.app.dispatcher.trigger('dropbox-prepare', function() {
               model.forEach(function(loop) {
                    model.app.dispatcher.trigger('save-loop', loop);
                }); 
            });
        },
                
        initialize: function() {
            this.app.dispatcher.on('loop-added', this.add, this);
            this.app.dispatcher.on('play-loop', this.stopAll, this);
            this.app.dispatcher.on('save-loops', this.saveLoops, this);
            this.app.dispatcher.on('change-volume', this.changeVolumes, this);
            this.app.dispatcher.on('change-pitch', this.changePitches, this);
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        }
        
    });
    
    return Collection;
    
});
