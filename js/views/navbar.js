/**
 *
 *
 *
 *
 */

define(['backbone', 'models/dropbox'], function(Backbone, Dropbox) {
    
    var View = Backbone.View.extend({
        
        el: '#view-navbar',
        
        model: null,
        
        events: {
            'click button#auth-btn': 'auth',
            'click button#signout-btn': 'signout',
        },
        
        auth: function(ev) {
            ev.preventDefault();
            this.model.auth(function(dropbox) {
                console.log(dropbox.getUserInfo());
            });
        },
        
        signout: function(ev) {
            ev.preventDefault();
            this.model.signOut();
        },
        
        signedIn: function() {
            var view = this;
            if (view.$el.find('button#auth-btn').length > 0) {
                view.$el.find('button#auth-btn').remove();
            }
            view.model.getUserInfo(function(info) {
                view.getTemplate('/looper/views/signout.html', {}, function(res) {
                    view.show(res, view.$el.find('#navbar-buttons'), true);
                    view.getTemplate('/looper/views/signinmsg.html', {name: info.name}, function(res) {
                        view.show(res, view.$el.find('#navbar-buttons'), true);
                    }); 
                });
            });
        },
        
        signedOut: function() {
            var view = this;
            if (view.$el.find('button#signout-btn').length > 0) {
                view.$el.find('p#signin-msg').remove();
                view.$el.find('button#signout-btn').remove();
            }
            view.getTemplate('/looper/views/signin.html', {}, function(res) {
                view.show(res, view.$el.find('#navbar-buttons'), true);
            });
        },
                
        initialize: function() {
            this.app.dispatcher.on('signed-in', this.signedIn, this);;
            this.app.dispatcher.on('signed-out', this.signedOut, this);
        },
        
        render: function() {}
        
    });
    
    return View;
});
