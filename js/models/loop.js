/**
 *
 *
 *
 *
 */
 
define(['backbone', 'rsvp', 'Howler', 'models/audio'], function(Backbone, RSVP, Howl, Audio) {

    "use strict";
    
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
        
        instantiateAudio: function(options) {
            var self = this;
            return new RSVP.Promise(function(resolve, reject) {
                self.audio = new Audio(options);
                self.audio.loadAudio()
                    .then(function() {
                        resolve(self);
                    }).catch(function(error) {
                        reject(Error(error));
                    });
            });
        },
                        
        initialize: function() {
        }
        
    });
    
    return Model;
    
});
