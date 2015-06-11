/**
 *
 *
 *
 *
 */

define(['backbone', 'views/loopbutton', 'views/saveloopsbutton'], function(Backbone, LoopButtonView, SaveLoopsButtonView) {
   
    var View = Backbone.View.extend({
        
        el: '#view-loops',
        
        addLoopButton: function(name, audioFile) {
            var view = this;
            var button = new LoopButtonView({model: audioFile});
            view.$el.find('div#loop-buttons').append(button.$el);
            button.getTemplate('/looper/views/playloop.html', {name: name}, function(res) {
                button.$el.html(res);
                view.addSaveButton();
            });
        },
        
        addSaveButton: function() {
            var view = this;
            if (view.$el.find('button#save-loops').length == 0) {
                var button = new SaveLoopsButtonView({model: this.app.models.dropBox});
                view.$el.find('div#loops-utility-buttons').append(button.$el);
                button.getTemplate('/looper/views/saveloops.html', {}, function(res) {
                    button.$el.html(res);
                });
            }
        },
        
        initialize: function() {},
        
        render: function() {}
        
    });
   
    return View;
    
});
 