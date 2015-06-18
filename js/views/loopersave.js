/**
 *
 *
 *
 *
 */
 
"use strict"
 
define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
        
        el: '#view-looper-save',
        
        events: {
            'click button#save-loops': 'saveLoops'
        },
        
        addSaveForm: function() {
            var view = this;
            if (view.$el.find('form#view-saveform').length == 0) {
                view.getTemplate('/looper/views/saveloops.html', {}, function(res) {
                    view.show(res, view.$el, true, function(form) {
                        form.find('input[name=looper-name]').on('input', function() {
                            view.app.dispatcher.trigger('change-looper-name', this.value);                            
                        });
                    });
                });
            }
        },
                
        saveLoops: function(ev) {
            ev.preventDefault();
            this.app.dispatcher.trigger('save-loops');
            this.app.dispatcher.trigger('add-status-message', {message: 'Saving audio files to Dropbox...'});
        },
        
        initialize: function() {
            this.app.dispatcher.on('loops-added', this.addSaveForm, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 