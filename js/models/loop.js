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
            looperId: '',
            userId: '',
            name: '',
            dropboxURL: '',
            fileType: '',
            fileExtension: '',
        },
        
        setAudioProperties: function(params) {
            if (params.context) {
                this.context = params.context;
            }
            if (params.volume) {
                this.volume = params.volume;
            }
            if (params.pitch) {
                this.pitch = params.pitch;
            }
            if (params.audioData) {
                this.audioData = params.audioData;
            }
        },
        
        getAudioProperties: function() {
            return {context: this.context, volume: this.volume, pitch: this.pitch, audioData: this.audioData}
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
                model.audioData = ev.target.result;
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
                        model.audioData = ev.target.result;
                    };
                    model.reader.readAsArrayBuffer(xhr.response);
                    cb(model);
                }
            }, false);
            xhr.send();
        },
        
        stopLoop: function() {
            if (this.isPlaying) {
                var source = this.source;
                source.stop();
                this.isPlaying = false;
            }
        },
        
        playLoop: function() {
            var model = this;
            model.stopLoop();
            var data = model.audioData.slice(0);
            if (data instanceof ArrayBuffer) {
                var context = model.context;
                context.decodeAudioData(data, function(buffer) {
                    var source = context.createBufferSource();
                    model.source = source;
                    source.buffer = buffer;
                    var gain = context.createGain();
                    model.gain = gain;
                    source.connect(gain);
                    gain.connect(context.destination);
                    source.start(0);
                    model.app.dispatcher.trigger('play-loop', model);
                    source.loop = true;
                    model.isPlaying = true;
                    model.setVolume(model.volume);
                    model.setPitch(model.pitch);
                });
            }
        },
        
        setVolume: function(level) {
            this.volume = level;
            if (this.isPlaying && level) {
                var gain = this.gain;
                gain.gain.value = level;
            }
        },
        
        setPitch: function(level) {
            this.pitch = level;
            if (this.isPlaying && level) {
                var source = this.source;
                source.playbackRate.value = level;
            }
        },
        
        saveMetaData: function() {
            this.save(this.attributes);
        },
        
        initialize: function() {
            this.set('loopId', Math.random().toString(36).replace(/[^a-z]+/g, ''));
            this.on('change:dropboxURL', this.saveMetaData, this);
        }
        
    });
    
    return Model;
    
});
