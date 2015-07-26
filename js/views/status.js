/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {

    "use strict";
   
    var View = Backbone.View.extend({
        
        el: '#view-status',
        
        events: {},
        
        addStatusMessage: function(message) {
            var self = this;
            self.getTemplate(self.app.config.siteRoot + '/views/statusmessage.html', {message: message}).then(function(res) {
                return self.show(res, self.$el, true)
            }).then(function(messageEl) {
                messageEl.delay(5000).fadeOut(300);
            }).catch(function(error) {
                console.log(error);
            });
        },
                
        initialize: function() {
            this.listenTo(this.app.dispatcher, 'status', this.addStatusMessage);
        },
        
        render: function() {}
        
    });
   
    return View;
    
});

        