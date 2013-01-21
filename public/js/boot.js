require.config({
    paths: {
        jQuery: '/js/lib/jquery',
        Underscore: '/js/lib/underscore',
        Backbone: '/js/lib/backbone',
        text: '/js/lib/text',
        templates: '../templates'
    },
    
    shim: {
        'Backbone': ['Underscore', 'jQuery'],
        'SocialNet': ['Backbone']
    }
});

require(['SocialNet'], function(SocialNet){
    SocialNet.initialize();
});