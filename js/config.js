/**
 *
 *
 *
 *
 */

"use strict"
 
define(function() {
    
    var Config = function() {
        
        this.siteRoot = '/looper';
        
        this.dropBoxDir = 'looper-audio';
        
        this.dropboxAPIKey = 'zr16qymzqg21hzf';
        
        this.dropboxDropinKey = '3oyl33j84sk1elk';
        
        this.oAuthReceiverURL = 'https://' + window.location.hostname + this.siteRoot + '/dropbox-receiver.html';
        
    };
    
    return Config;
}); 
