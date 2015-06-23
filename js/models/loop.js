/**
 *
 *
 *
 *
 */
 
"use strict"

define(['backbone', 'rsvp', 'Howler', 'models/audio'], function(Backbone, RSVP, Howl, Audio) {
    
    var Model = Backbone.Model.extend({
        
        idAttribute: '_id',
           
        defaults: {
            loopFileId: '',
            name: '',
            dropboxURL: '',
            fileType: '',
            fileExtension: ''
        },
        
        audio: null,
                
        /**
         * http://stackoverflow.com/a/5100158/3619924
         */
        dataURItoBlob: function(dataURI) {
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                byteString = atob(dataURI.split(',')[1]);
            } else {
                byteString = unescape(dataURI.split(',')[1]);
            }
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], {type:mimeString});
        },
                
        readFile: function(file) {
            var model = this;
            var reader = new FileReader();
            return new RSVP.Promise(function(resolve, reject) {
                model.set('fileType', file.type);
                var fileMatches = file.name.match(/\.(.*)$/);
                if (fileMatches && fileMatches[1]) {
                    model.set('fileExtension', fileMatches[1]);
                }
                reader.onload = function(ev) {
                    model.instantiateAudio({src: ev.target.result}).then(function() {
                        resolve(model);
                    });
                };
                reader.onerror = function(error) {
                    reject(Error(error));
                };
                reader.readAsDataURL(file);
            });
        },
                
        readFromURL: function(url) {
            var model = this;
            return new RSVP.Promise(function(resolve, reject) {
                model.instantiateAudio({src: url}).then(function() {
                    resolve(model);
                });
            });
        },
        
        instantiateAudio: function(options) {
            var self = this;
            return new RSVP.Promise(function(resolve, reject) {
                self.audio = new Audio(options);
                self.audio.loadAudio().then(function() {
                    resolve(self);
                });
            });
        },
                        
        initialize: function() {
            this.set('loopFileId', Math.random().toString(36).replace(/[^a-z]+/g, ''));
        }
        
    });
    
    return Model;
    
});
