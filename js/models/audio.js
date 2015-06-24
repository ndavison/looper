/**
 *
 *
 *
 *
 */

"use strict";
 
define(['backbone', 'Howler', 'rsvp'], function(Backbone, Howl, RSVP) {
    
    var Model = Backbone.Model.extend({
        
        defaults: {
            src: '',
            loop: true,
            volume: 1,
            pitch: 1
        },
        
        howler: null,
        
        play: function() {
            if (this.howler) {
                this.howler.play();
                this.setVolume(this.get('volume'));
                this.setPitch(this.get('pitch'));
            }
        },
        
        stop: function() {
            if (this.howler) {
                this.howler.stop();
            }
        },
        
        setVolume: function(level) {
            this.set('volume', level);
            if (level && this.howler) {
                this.howler.volume(level);
            }
        },
        
        setPitch: function(level) {
            this.set('pitch', level);
            if (level && this.howler && this.howler._sounds[0] && this.howler._sounds[0]._node.bufferSource) {
                this.howler._sounds[0]._node.bufferSource.playbackRate.value = level;
            }
        },
        
        loadAudio: function() {
            var self = this;
            return new RSVP.Promise(function(resolve, reject) {
                var howler = new Howl({
                    src: self.get('src'),
                    loop: self.get('loop'),
                    volume: self.get('volume'),
                    rate: self.get('rate'),
                    onload: function() {
                        self.howler = this;
                        resolve(self);
                    },
                    onloaderror: function(error) {
                        reject(Error(error));
                    }
                });
            });
        },
        
        initialize: function() {}
        
    });
    
    return Model;
    
});
