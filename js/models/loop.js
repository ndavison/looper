/**
 *
 *
 *
 *
 */
 
"use strict"

define(['backbone'], function(Backbone) {
    
    var Model = Backbone.Model.extend({
        
        defaults: {
            loopId: '',
            name: '',
            dropboxURL: '',
            fileType: '',
            fileExtension: '',
            volume: 1,
            pitch: 1,
            audioData: null
        },
        
        reader: new FileReader(),
                
        isPlaying: false,
        
        readFile: function(file, cb) {
            var model = this;
            cb = cb || function() {};
            model.set('fileType', file.type);
            var fileMatches = file.name.match(/\.(.*)$/);
            if (fileMatches[1]) {
                model.set('fileExtension', fileMatches[1]);
            }
            model.reader.readAsArrayBuffer(file);
            model.reader.onload = function(ev) {
                model.set('audioData', ev.target.result);
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
                        model.set('audioData', ev.target.result);
                    };
                    model.reader.readAsArrayBuffer(xhr.response);
                    cb(model);
                }
            }, false);
            xhr.send();
        },
        
        stopLoop: function() {
            if (this.isPlaying) {
                var source = this.get('source');
                source.stop();
                this.isPlaying = false;
            }
        },
        
        playLoop: function() {
            var model = this;
            model.stopLoop();
            var data = model.get('audioData').slice(0);
            if (data instanceof ArrayBuffer) {
                var context = model.get('context');
                context.decodeAudioData(data, function(buffer) {
                    var source = context.createBufferSource();
                    model.set('source', source);
                    source.buffer = buffer;
                    var gain = context.createGain();
                    model.set('gain', gain);
                    source.connect(gain);
                    gain.connect(context.destination);
                    source.start(0);
                    source.loop = true;
                    model.isPlaying = true;
                    model.setVolume(model.get('volume'));
                    model.setPitch(model.get('pitch'));
                });
            }
        },
        
        setVolume: function(level) {
            this.set('volume', level);
            if (this.isPlaying && level) {
                var gain = this.get('gain');
                gain.gain.value = level;
            }
        },
        
        setPitch: function(level) {
            this.set('pitch', level);
            if (this.isPlaying && level) {
                var source = this.get('source');
                source.playbackRate.value = level;
            }
        },
        
        initialize: function() {
            this.set('loopId', Math.random().toString(36).replace(/[^a-z]+/g, ''));
        }
        
    });
    
    return Model;
    
});
