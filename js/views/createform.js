/**
 *
 *
 *
 *
 */

define(['backbone', 'jquery','rsvp', 'dropboxdropins', 'models/loop'], function(Backbone, $, RSVP, Dropbox, Loop) {

    "use strict";
    
    var View = Backbone.View.extend({
        
        events: {
            'change input[name=looper-file]': 'getFromFileReader',
            'click button#dropbox-loop': 'getFromDropbox'
        },
        
        addLoadFromDropboxButton: function() {
            var self = this;
            if (self.$('button#dropbox-loop').length == 0) {
                self.getTemplate('/looper/views/loadfromdropbox.html').then(function(res) {
                    return self.show(res, self.$('div#dropbox-button-area'), true);
                }).catch(function(error) {
                    console.log(error);
                    self.app.views.alerts.createAlert('Failed to load the dropbox button template.', 'danger');
                });
            }
        },
        
        removeLoadFromDropboxButton: function() {
            this.$('button#dropbox-loop').remove();
        },
        
        getFromFileReader: function(ev) {
            ev.preventDefault();
            var self = this;
            var fileEl = this.$('input[name="looper-file"]');
            
            for (var i = 0; i < fileEl[0].files.length; i++) {
                var file = fileEl[0].files[i];
                if (!file.type.match(/^(audio\/(mpeg|wav|)|video\/ogg)/)) {
                    self.app.views.alerts.createAlert('The file ' + file.name + ' was not an audio file! supported formats include WAV, MP3 and OGG.', 'danger');
                    continue;
                }
                var reader = new FileReader();
                reader.onload = function(ev) {
                    var file = this.file;
                    var fileMatches = file.name.match(/\.(.*)$/);
                    var fileExtension = fileMatches && fileMatches[1] ? fileMatches[1] : '';
                    self.app.dispatcher.trigger('file-read', {name: '', data: ev.target.result, fileType: file.type, fileExtension: fileExtension});
                };
                reader.onerror = function(error) {
                    self.app.views.alerts.createAlert('Failed to read file - please try again.', 'danger');
                };
                reader.file = file;
                reader.readAsDataURL(file);
            }
        },
        
        getFromDropbox: function(ev) {
            ev.preventDefault();
            var self = this;
            Dropbox.appKey = self.app.config.dropboxDropinKey;
            Dropbox.choose({multiselect: true, linkType: 'direct', extensions: ['audio'], success: function(files) {
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var fileMatches = file.name.match(/\.(.*)$/);
                        var fileExtension = fileMatches && fileMatches[1] ? fileMatches[1] : '';
                        self.app.dispatcher.trigger('file-read', {name: '', dropboxURL: file.link, fileExtension: fileExtension});
                    }
                }
            }});
        },
        
        initialize: function() {
            this.listenTo(this.app.dispatcher, 'signed-in', this.addLoadFromDropboxButton);
            this.listenTo(this.app.dispatcher, 'signed-out', this.removeLoadFromDropboxButton);
        },
        
        render: function() {
            var self = this;
            self.getTemplate('/looper/views/createform.html').then(function(res) {
                self.show(res);
                self.delegateEvents();
            }).then(function() {
                if (self.app.models.dropBox.isAuthenticated()) {
                    self.addLoadFromDropboxButton();
                }
            }).catch(function(error) {
                self.app.views.alerts.createAlert('Failed to load the create looper form.', 'danger');
            });
        }
        
    });
    
    return View;
});
