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
            view.getTemplate('/looper/views/statusmessage.html', {message: message}).then(function(res) {
                return view.show(res, view.$el, true)
            }).then(function(messageEl) {
                messageEl.delay(5000).fadeOut(300);
            }).catch(function(error) {
                console.log(error);
            });
        },
                
        initialize: function() {
            this.app.dispatcher.on('status', this.addStatusMessage, this);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});

        