/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
    
    var Model = Backbone.Model.extend({
        
        reader: new FileReader(),
        
        initialize: function() {
            this.attributes.loopId = Math.random().toString(36).replace(/[^a-z]+/g, '');
        },
        
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
        
        readFromURL: function(url, cb) {
            var model = this;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.addEventListener("load", function () {
                if (xhr.status === 200) {
                    model.reader.onload = function (ev) {
                        model.attributes.data = ev.target.result;
                    };
                    model.reader.readAsArrayBuffer(xhr.response);
                    cb(model);
                }
            }, false);
            xhr.send();
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
            if (this.isPlaying && level) {
                this.attributes.gain.gain.value = level;
            }
        },
        
        pitch: function(level) {
            this.attributes.pitch = level;
            if (this.isPlaying && level) {
                this.attributes.source.playbackRate.value = level;
            }
        }
        
    });
    
    return Model;
    
});
