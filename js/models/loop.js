/**
 *
 *
 *
 *
 */
 
"use strict"

define(['backbone', 'rsvp', 'Howler'], function(Backbone, RSVP, Howl) {
    
    var Model = Backbone.Model.extend({
        
        defaults: {
            loopId: '',
            looperId: '',
            looperName: '',
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
            return {volume: this.volume, pitch: this.pitch, audioData: this.audioData}
        },
                
        readFile: function(file) {
            var model = this;
            return new RSVP.Promise(function(resolve, reject) {
                model.set('fileType', file.type);
                var fileMatches = file.name.match(/\.(.*)$/);
                if (fileMatches && fileMatches[1]) {
                    model.set('fileExtension', fileMatches[1]);
                }
                model.reader.onload = function(ev) {
                    var loopSound = new Howl({
                        src: [ev.target.result],
                        loop: true,
                        volume: model.getAudioProperties().volume,
                        rate: model.getAudioProperties().pitch,
                        onload: function() {
                            model.howl = this;
                            resolve(model);
                        },
                        onloaderror: function(error) {
                            reject(Error(error));
                        }
                    });
                };
                model.reader.onerror = function(error) {
                    reject(Error(error));
                };
                model.reader.readAsDataURL(file);
            });
        },
                
        readFromURL: function(url) {
            var model = this;
            return new RSVP.Promise(function(resolve, reject) {
                var loopSound = new Howl({
                    src: [url],
                    loop: true,
                    volume: model.getAudioProperties().volume,
                    rate: model.getAudioProperties().pitch,
                    onload: function() {
                        model.howl = this;
                        resolve(model);
                    },
                    onloaderror: function(error) {
                        reject(Error(error));
                    }
                });
            });
        },
        
        stopLoop: function() {
            if (this.howl) {
                this.howl.stop();
            }
        },
        
        playLoop: function() {
            var model = this;
            model.howl.play();
            model.setVolume(model.volume);
            model.setPitch(model.pitch);
        },
        
        setVolume: function(level) {
            this.volume = level;
            if (level) {
                this.howl.volume(level);
            }
        },
        
        setPitch: function(level) {
            this.pitch = level;
            if (level && this.howl._sounds[0] && this.howl._sounds[0]._node.bufferSource) {
                this.howl._sounds[0]._node.bufferSource.playbackRate.value = level;
            }
        },
        
        saveMetaData: function() {
            this.save(this.attributes);
        },
        
        initialize: function() {
            this.set('loopId', Math.random().toString(36).replace(/[^a-z]+/g, ''));
            this.on('change:dropboxURL', this.saveMetaData, this);
            this.reader = new FileReader();
        }
        
    });
    
    return Model;
    
});
