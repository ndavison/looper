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
            'click button#auth-btn': 'handleAuthClick',
            'click button#signout-btn': 'handleSignOutClick',
        },
        
        handleAuthClick: function(ev) {
            ev.preventDefault();
            this.auth();
        },
        
        handleSignOutClick: function(ev) {
            ev.preventDefault();
            this.signOut();
        },
        
        auth: function() {
            var view = this;
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
                view.app.views.alerts.createAlert('There was a problem with authentication. It could be that Dropbox is experiencing issues. Please try again.', 'danger');
            });
        },
        
        signOut: function() {
            var view = this;
            this.app.models.dropBox.signOut().then(function() {
                view.app.dispatcher.trigger('signed-out');
            }).catch(function(error) {
                view.app.views.alerts.createAlert('There was a problem with signing you out. It could be that Dropbox is experiencing issues. Please try again (or consider deleting your dropbox.com cookies if you really want to sign out).', 'danger');
            });;
        },
        
        onSignedIn: function() {
            var view = this;
            if (view.$('button#auth-btn').length > 0) {
                view.$('button#auth-btn').remove();
            }
            view.app.models.dropBox.getAccountInfo()
                .then(function(info) {
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
                    view.app.views.alerts.createAlert('There was a problem with gathering your user account information from Dropbox. Please try refreshing the page and trying again.', 'danger');
                });
        },
        
        onSignedOut: function() {
            var view = this;
            if (view.$('button#signout-btn').length > 0) {
                view.$('p#signin-msg').remove();
                view.$('button#signout-btn').remove();
            }
            view.getTemplate('/looper/views/signin.html', {})
                .then(function(res) {
                    return view.show(res, view.$('#navbar-buttons'), true);
                }).catch(function(error) {
                    console.log(error);
                });
        },
                
        initialize: function() {
            this.listenTo(this.app.dispatcher, 'signed-in', this.onSignedIn);
            this.listenTo(this.app.dispatcher, 'signed-out', this.onSignedOut);
        },
        
        render: function() {}
        
    });
    
    return View;
});
