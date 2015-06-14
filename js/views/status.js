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
        
        addStatusMessage: function(options) {
            var view = this;
            view.getTemplate('/looper/views/statusmessage.html', {message: options.message}, function(res) {
                view.show(res, view.$el);
            });
            if (options.timeout) {
                setTimeout(function() {
                    view.clearStatusMessage();
                }, 3000);
            }
        },
        
        clearStatusMessage: function() {
            this.addStatusMessage({message: ''});
        },
        
        initialize: function() {
            this.app.dispatcher.on('add-status-message', this.addStatusMessage, this);
            this.app.dispatcher.on('clear-status-message', this.clearStatusMessage, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});

        