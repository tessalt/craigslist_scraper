
$(document).ready(function(){

  function isInside(lat, lng) {
    return geolib.isPointInside(
      {latitude: lat, longitude: lng},
        [
          {latitude: 43.63484, longitude: -79.42576},
          {latitude: 43.65410, longitude: -79.43327},
          {latitude: 43.66214, longitude: -79.37975},
          {latitude: 43.64565, longitude: -79.36984}
        ]
    );
  }

  function fetchListings(listing) {
    if (listing.NumPosts > 1) {
      var returned = $.get(listing.url, function(data){
        for (var j = 0; j < data[0].length; j++) {
          fetchListings(data[0][i]);
        }
      });
    } else {
      return listing;
    }
  }

  $.get('/listings', function(data){
    for (var i = 0; i < data[0].length; i++) {
      var listing = data[0][i];
      var inside = isInside(listing.Latitude, listing.Longitude)
      if (inside == true && listing.Ask > 0 && listing.Ask < 1100) {
        console.log(fetchListings(listing));
      }
    }
  });

});