/**
 *
 *
 *
 *
 */

define(['backbone'], function(Backbone) {
    
    var View = Backbone.View.extend({
                
        events: {
            'click button': 'doSearch'
        },
        
        doSearch: function(ev) {
            ev.preventDefault();
        },
        
        initialize: function() {},
        
        render: function() {
            var self = this;
            self.getTemplate('/looper/views/findlooper.html').then(function(res) {
                self.show(res);
                self.delegateEvents();
            }).catch(function(error) {
                console.log(error);
            });
        }
        
    });
    
    return View;
    
});
