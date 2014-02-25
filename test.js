(function(){

  var app = {};

  var get_config = $.get('/config');

  var get_cl_listings = $.get('/listings');

  function init () {

    get_config.done(function(response){

      app.config = response;

      get_cl_listings.done(function(response){
        console.log(response);
      });

    });

  }

  init();

})();