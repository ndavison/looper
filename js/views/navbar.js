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
            var self = this;
            self.app.models.dropBox.auth().then(function(success) {
                if (success) {
                    self.app.dispatcher.trigger('signed-in');
                    return self.app.models.dropBox.getAccountInfo();
                } else {
                    self.app.dispatcher.trigger('signed-out');
                    return null;
                }
            }).then(function(accountInfo) {
                if (accountInfo) {
                    self.app.dispatcher.trigger('signed-in-user-info', accountInfo);
                }
            }).catch(function(error) {
                self.app.views.alerts.createAlert('There was a problem with authentication. It could be that Dropbox is experiencing issues. Please try again.', 'danger');
            });
        },
        
        signOut: function() {
            var self = this;
            this.app.models.dropBox.signOut().then(function() {
                self.app.dispatcher.trigger('signed-out');
            }).catch(function(error) {
                self.app.views.alerts.createAlert('There was a problem with signing you out. It could be that Dropbox is experiencing issues. Please try again (or consider deleting your dropbox.com cookies if you really want to sign out).', 'danger');
            });;
        },
        
        onSignedIn: function() {
            var self = this;
            if (self.$('button#auth-btn').length > 0) {
                self.$('button#auth-btn').remove();
            }
            self.app.models.dropBox.getAccountInfo()
                .then(function(info) {
                    return self.getTemplate('/looper/views/signout.html', {})
                        .then(function(res) {
                            var promises = [
                                self.show(res, self.$('#navbar-buttons'), true),
                                self.getTemplate('/looper/views/signinmsg.html', {name: info.name}).then(function(res) {
                                    return self.show(res, self.$('#navbar-buttons'), true);
                                })
                            ];
                            return RSVP.all(promises);
                        });
                }).catch(function(error) {
                    self.app.views.alerts.createAlert('There was a problem with gathering your user account information from Dropbox. Please try refreshing the page and trying again.', 'danger');
                });
        },
        
        onSignedOut: function() {
            var self = this;
            if (self.$('button#signout-btn').length > 0) {
                self.$('p#signin-msg').remove();
                self.$('button#signout-btn').remove();
            }
            self.getTemplate('/looper/views/signin.html', {})
                .then(function(res) {
                    return self.show(res, self.$('#navbar-buttons'), true);
                }).catch(function(error) {
                    self.app.views.alerts.createAlert('Failed to load the sign in template.', 'danger');
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
