/**
 *
 *
 *
 *
 */

define(['backbone', 'jquery', 'models/audiofiles', 'models/audiofile'], function(Backbone, $, AudioFiles, AudioFile) {
    
    var View = Backbone.View.extend({
        
        el: '#view-createform',
        
        audioFiles: null,
        
        events: {
            'click button#create-loop': 'createLoop',
            'click button#demo-loop': 'demoLoop'
        },
        
        createLoop: function(ev) {
            ev.preventDefault();
            var view = this;
            var file = this.$el.find('input[name="looper-file"]');
            var audioFile = new AudioFile({context: view.audioFiles.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
            audioFile.readFile(file[0].files[0], function(model) {
                if (!model.attributes.file.type.match(/^(audio\/(mpeg|wav|)|video\/ogg)/)) {
                    view.app.views.alerts.createAlert('The file must be a WAV, MP3 or OGG audio file.', 'danger');
                    return;
                }
                view.audioFiles.add(audioFile);
                view.app.dispatcher.trigger('loop-added', view.$el.find('input[name=looper-name]').val(), audioFile.get('loopId'));
            });
        },
        
        demoLoop: function(ev) {
            ev.preventDefault();
            var view = this;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/audioclip-1433848478.wav", true);
            xhr.responseType = "blob";
         
            var audioFile = new AudioFile({context: view.audioFiles.context, volume: view.app.views.controls.getVolume(), pitch: view.app.views.controls.getPitch()});
            
            xhr.addEventListener("load", function () {
                if (xhr.status === 200) {
                    audioFile.reader.onload = function (ev) {
                        audioFile.attributes.data = ev.target.result;
                        view.audioFiles.add(audioFile);
                        console.log(view.audioFiles);
                        view.app.dispatcher.trigger('loop-added', 'Demo Loop', audioFile.get('loopId'));
                    };
                    audioFile.reader.readAsArrayBuffer(xhr.response);
                }
            }, false);
            xhr.send();

        },
        
        initialize: function() {
            this.audioFiles = new AudioFiles();
        },
        
        render: function() {}
        
    });
    
    return View;
});
