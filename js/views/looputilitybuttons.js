/**
 *
 *
 *
 *
 */
 
"use strict"
 
define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
        
        el: '#view-loop-utility-buttons',
        
        events: {
            'click button#save-loops': 'saveLoops'
        },
        
        addSaveLoopsButton: function() {
            var view = this;
            if (view.$el.find('button#save-loops').length == 0) {
                view.getTemplate('/looper/views/saveloops.html', {}, function(res) {
                    view.show(res, view.$el, true);
                });
            }
        },
                
        saveLoops: function(ev) {
            ev.preventDefault();
            this.app.dispatcher.trigger('save-loops');
            this.app.dispatcher.trigger('add-status-message', {message: 'Saving audio files to Dropbox...'});
        },
        
        initialize: function() {
            this.app.dispatcher.on('loop-added', this.addSaveLoopsButton, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});
 