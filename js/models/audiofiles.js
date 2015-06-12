/**
 *
 *
 *
 *
 */

define(['backbone', 'models/audiofile'], function(Backbone, AudioFile) {
    
    var Collection = Backbone.Collection.extend({
        
        model: AudioFile,
        
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
            this.invoke('volume', level);
        },
        
        changePitches: function(level) {
            this.invoke('pitch', level);
        },
        
        initialize: function() {
            this.app.dispatcher.on('play-loop', this.stopAll, this);
            this.app.dispatcher.on('play-loop', this.playLoop, this);
            this.app.dispatcher.on('change-volume', this.changeVolumes, this);
            this.app.dispatcher.on('change-pitch', this.changePitches, this);
            this.context = new AudioContext();
        }
        
    });
    
    return Collection;
    
});
