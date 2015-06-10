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
            'submit': 'formSubmit'
        },
        
        formSubmit: function(ev) {
            ev.preventDefault();
            var view = this;
            var file = this.$el.find('input[name="looper-file"]');
            var audioFile = new AudioFile({context: view.audioFiles.context, volume: view.app.views.volume.getVolume(), pitch: view.app.views.pitch.getPitch()});
            audioFile.readFile(file[0].files[0], function(model) {
                view.audioFiles.add(model);
                if (!model.attributes.file.type.match(/^(audio\/(mpeg|wav|)|video\/ogg)/)) {
                    view.app.views.alerts.createAlert('The file must be a WAV, MP3 or OGG audio file.', 'danger');
                    return;
                }
                view.app.views.loops.addLoopButton(view.$el.find('input[name=looper-name]').val(), audioFile);
            });
        },
        
        initialize: function() {
            this.audioFiles = new AudioFiles();
            this.render();
        },
        
        render: function() {
            var view = this;
            view.getView('/looper/views/createform.html', view.$el);
        }
        
    });
    
    return View;
});
