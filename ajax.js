$(document).ready(function(){

 moment().format();

 var today = moment();

 var list = $("#listings");

 var rootURL = 'http://toronto.en.craigslist.ca/';

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
    $.get(listing.url, function(resp){
      var item = jQuery.parseJSON(resp);
      item = item[0];
      console.log(item);
    });
  }

  function walk(data) {
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
          console.log("inBounds: " + inBounds + "  Price: " + listings[i].Ask);
          if (inBounds == true && listings[i].Ask > 1 && listings[i].Ask < 1101) {
            var li = $("<li>");
            var html = "<a href='" + rootURL + listings[i].PostingURL + "'>" + listings[i].PostingTitle + "</a>";
            if (inBounds == true) {
              html += "<strong>INBOUNDS</strong>";
            }
            li.html(html);
            list.append(li);
          }
        }
      }
    }
  }


  $.get('/listings', function(data){
    walk(data);
  });

});