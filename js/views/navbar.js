/**
 *
 *
 *
 *
 */
 
"use strict"

define(['backbone', 'rsvp'], function(Backbone, RSVP) {
    
    var View = Backbone.View.extend({
        
        el: '#view-navbar',
                
        events: {
            'click button#auth-btn': 'auth',
            'click button#signout-btn': 'signOut',
        },
        
        auth: function(ev) {
            var view = this;
            ev.preventDefault();
            view.app.models.dropBox.auth().then(function(success) {
                if (success) {
                    view.app.dispatcher.trigger('signed-in');
                    return view.app.models.dropBox.getAccountInfo();
                } else {
                    view.app.dispatcher.trigger('signed-out');
                    return null;
                }
            }).then(function(accountInfo) {
                if (accountInfo) {
                    view.app.dispatcher.trigger('signed-in-user-info', accountInfo);
                }
            }).catch(function(error) {
                console.log(error);
            });
        },
        
        signOut: function(ev) {
            var view = this;
            ev.preventDefault();
            this.app.models.dropBox.signOut().then(function() {
                view.app.dispatcher.trigger('signed-out');
            }).catch(function(error) {
                console.log(error);
            });;
        },
        
        signedIn: function() {
            var view = this;
            if (view.$('button#auth-btn').length > 0) {
                view.$('button#auth-btn').remove();
            }
            view.app.models.dropBox.getAccountInfo().then(function(info) {
                return view.getTemplate('/looper/views/signout.html', {})
                    .then(function(res) {
                        var promises = [
                            view.show(res, view.$('#navbar-buttons'), true),
                            view.getTemplate('/looper/views/signinmsg.html', {name: info.name}).then(function(res) {
                                return view.show(res, view.$('#navbar-buttons'), true);
                            })
                        ];
                        return RSVP.all(promises);
                    });
            }).catch(function(error) {
                console.log(error);
            });
        },
        
        signedOut: function() {
            var view = this;
            if (view.$('button#signout-btn').length > 0) {
                view.$('p#signin-msg').remove();
                view.$('button#signout-btn').remove();
            }
            view.getTemplate('/looper/views/signin.html', {}).then(function(res) {
                return view.show(res, view.$('#navbar-buttons'), true);
            }).catch(function(error) {
                console.log(error);
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
