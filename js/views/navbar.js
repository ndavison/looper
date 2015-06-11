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
        
        toggleSignInButton: function() {
            var view = this;
            if (view.$el.find('button#auth-btn').length > 0) {
                view.$el.find('button#auth-btn').remove();
            } else {
                view.getTemplate('/looper/views/signin.html', {}, function(res) {
                    view.$el.find('#navbar-buttons').append(res);
                });
            }
        },
                
        toggleSignOutButton: function() {
            var view = this;
            if (view.$el.find('button#signout-btn').length > 0) {
                view.$el.find('p#signin-msg').remove();
                view.$el.find('button#signout-btn').remove();
            } else {
                view.model.getUserInfo(function(info) {
                    view.getTemplate('/looper/views/signout.html', {}, function(res) {
                        view.$el.find('#navbar-buttons').append(res);
                        view.getTemplate('/looper/views/signinmsg.html', {name: info.name}, function(res) {
                            view.$el.find('#navbar-buttons').append(res);
                        }); 
                    });
                });
            }
        },
        
        initialize: function() {
            this.app.dispatcher.on('signed-in', this.toggleSignInButton, this);
            this.app.dispatcher.on('signed-in', this.toggleSignOutButton, this);
            this.app.dispatcher.on('signed-out', this.toggleSignInButton, this);
            this.app.dispatcher.on('signed-out', this.toggleSignOutButton, this);
            this.toggleSignInButton();
        },
        
        render: function() {}
        
    });
    
    return View;
});
