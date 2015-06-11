/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
    
    var Model = Backbone.Model.extend({
        
        reader: new FileReader(),
        
        initialize: function() {},
        
        isPlaying: false,
        
        readFile: function(file, cb) {
            var model = this;
            model.attributes.file = file;
            cb = cb || function() {};
            model.reader.readAsArrayBuffer(file);
            model.reader.onload = function(ev) {
                model.attributes.data = ev.target.result;
                cb(model);
            };
        },
        
        stopLoop: function() {
            if (this.isPlaying) {
                this.attributes.source.stop();
                this.isPlaying = false;
            }
        },
        
        playLoop: function() {
            var model = this;
            model.stopLoop();
            var data = model.attributes.data.slice(0);
            if (data instanceof ArrayBuffer) {
                model.attributes.context.decodeAudioData(data, function(buffer) {
                    model.attributes.buffer = buffer;
                    model.attributes.source = model.attributes.context.createBufferSource();
                    model.attributes.source.buffer = buffer;
                    model.attributes.gain = model.attributes.context.createGain();
                    model.attributes.source.connect(model.attributes.gain);
                    model.attributes.gain.connect(model.attributes.context.destination);
                    model.attributes.source.start(0);
                    model.attributes.source.loop = true;
                    model.isPlaying = true;
                    model.volume(model.attributes.volume);
                    model.pitch(model.attributes.pitch);
                });
            }
        },
        
        volume: function(level) {
            this.attributes.volume = level;
            if (this.isPlaying) {
                this.attributes.gain.gain.value = level;
            }
        },
        
        pitch: function(level) {
            this.attributes.pitch = level;
            if (this.isPlaying) {
                this.attributes.source.playbackRate.value = level;
            }
        }
        
    });
    
    return Model;
    
});