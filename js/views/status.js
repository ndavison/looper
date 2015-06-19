/**
 *
 *
 *
 *
 */

"use strict"

define(['backbone'], function(Backbone) {
   
    var View = Backbone.View.extend({
        
        el: '#view-status',
        
        events: {},
        
        addStatusMessage: function(message) {
            var view = this;
            view.getTemplate('/looper/views/statusmessage.html', {message: message}, function(res) {
                view.show(res, view.$el, true, function(messageEl) {
                    messageEl.delay(3000).fadeOut(300);
                });
            });
        },
                
        initialize: function() {
            this.app.dispatcher.on('status', this.addStatusMessage, this);
            this.app.dispatcher.on('dropbox:status', this.addStatusMessage, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});

        