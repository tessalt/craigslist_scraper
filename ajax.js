(function(){

  var config = {};

 moment().format();

 var today = moment();

 var list = $("#listings");

  function isInside(lat, lng) {
    return geolib.isPointInside(
      {latitude: lat, longitude: lng},
        config.coordinates
    );
  }

  function walk(data) {
    var rootURL = 'http://' + config.city + '.en.craigslist.ca/';
    var listings = jQuery.parseJSON(data);
    listings = listings[0];
    for (var i = 0; i < listings.length; i++) {
      var stamp = moment(listings[i].PostedDate, 'X');
      var timeDiff = today.diff(stamp, 'days');
      if (timeDiff < 5) {
        if (listings[i].url !== undefined) {
          var inBounds = isInside(listings[i].Latitude, listings[i].Longitude);
          if (inBounds == true) {
            $.ajax({
              url: listings[i].url,
              success: function(resp) {
                walk(resp);
              }
            });
          }
        } else {
          var inBounds = isInside(listings[i].Latitude, listings[i].Longitude);
          if (inBounds == true && listings[i].Ask > 1 && listings[i].Ask < 1101) {
            var li = $("<li>");
            var html = "<a href='" + rootURL + listings[i].PostingURL + "'>" + listings[i].PostingTitle + "</a>";
            li.html(html);
            list.append(li);
          }
        }
      }
    }
  }

  $.get('/config', function(response){
    config = response;
    $.get('/listings', function(data){
      walk(data);
    });
  });

})();