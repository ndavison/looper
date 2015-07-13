/**
 *
 *
 *
 *
 */

define(['backbone', 'rsvp', 'models/loops', 'models/loop'], function(Backbone, RSVP, Loops, Loop) {
    
    var Model = Backbone.Model.extend({
        
        urlRoot: '/looper/api/loopers',
        
        idAttribute: '_id',
        
        defaults: {
            name: '',
            userId: '',
            loops: null
        },
        
        initialize: function() {
            this.set('loops', new Loops());
        },
        
        generateId: function() {
            return Math.random().toString(36).replace(/[^a-z]+/g, '');
        },
        
        /**
         * Instantiates a Loop.
         *
         * @param {Object} params - The Loop attributes.
         * @returns {RSVP.Promise}
         */
        createLoop: function(params) {
            var self = this;
            var loop = new Loop(params);
            if (!loop.get('loopFileId')) {
                loop.set('loopFileId', self.generateId());
            }
            if (!params.data && params.dropboxURL) {
                params.data = params.dropboxURL;
            }
            
            return loop.instantiateAudio({src: params.data});
        },
        
        /**
         * Converts the loops array provided into instances of 
         * the Loop model, and set them in the loops attribute.
         *
         * @param {Array} loops - An array of loops to populate.
         * @returns {RSVP.all}
         */
        populateLoops: function(loops) {
            var self = this;
            if (loops.length > 0) {
                var promises = [];
                self.set('loops', new Loops());
                for (var i = 0; i < loops.length; i++) {
                    promises.push(new RSVP.Promise(function(resolve, reject) {
                        return self.createLoop(loops[i])
                            .then(function(loop) {
                                self.get('loops').add(loop);
                                resolve(loop);
                            })
                            .catch(function(error) {
                                reject(Error(error));
                            });
                    }));
                }
            }
            
            return RSVP.all(promises);
        },
        
        /**
         * Override Backbone.Model#parse so the loops data coming back 
         * doesn't clobber the Loops collection instance already
         * present, if relevant, since the Loop instances inside 
         * it maintain a non-Backbone property for the audio data 
         * that we don't want synced to our server.
         *
         * @param {Object} response - The response back from the server.
         * @returns {Object}
         */
        parse: function(response) {
            var obj = {};
            obj._id = response._id;
            obj.name = response.name;
            obj.userId = response.userId;
            if (this.get('loops')) {
                obj.loops = this.get('loops');
            } else {
                obj.loops = response.loops;
            }
            return obj;
        }
        
    });
    
    return Model;
    
});
 