/**
 *
 *
 *
 *
 */

"use strict"
 
define(function() {
    
    var config = {
        
        siteRoot: '/looper',
        
        dropBoxDir: 'looper-audio',
        
        dropboxAPIKey: 'zr16qymzqg21hzf',
        
        dropboxDropinKey: '3oyl33j84sk1elk',
        
        oAuthReceiverURL: 'https://' + window.location.hostname + '/looper/dropbox-receiver.html'
        
    };
    
    return config;
}); 
