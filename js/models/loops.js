/**
 *
 *
 *
 *
 */

"use strict"
 
define(['backbone', 'models/loop'], function(Backbone, Loop) {
    
    var Collection = Backbone.Collection.extend({
        
        model: Loop,
        
        initialize: function() {}
        
    });
    
    return Collection;
    
});
