/**
 *
 *
 *
 *
 */

define(function() {

    "use strict";
    
    var Config = function() {
        
        this.siteRoot = '';
        
        this.dropBoxDir = 'looper-audio';
        
        this.dropboxAPIKey = 'hwa4du8r8utx5fa';
        
        this.dropboxDropinKey = 'hwa4du8r8utx5fa';
        
        this.oAuthReceiverURL = 'https://' + window.location.hostname + this.siteRoot + '/dropbox-receiver.html';
        
    };
    
    return Config;
}); 
