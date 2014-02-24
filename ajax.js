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
            var html = "<a target='_blank' href='" + rootURL + listings[i].PostingURL + "'>" + listings[i].PostingTitle + "</a>";
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

  var kj_listings_loaded = new $.Deferred();

  var kj_items = [];

  $.get('/kijiji', function(data){
    var listings = $(data).find('item');
    var links = [];
    var dfds = [];
    $.each(listings, function(index, item){
      var link = $(item).find('link');
      var url = $(link)[0].nextSibling.data;
      var index = url.lastIndexOf('/');
      url = url.substr(index + 1);
      links.push('/kijiji_listings?url=' + url);
    });
    $.each(links, function(index, item){
      var dfd = new $.Deferred();
      dfds.push(dfd);
      $.get(links[index], function(data){
        var response = $(data).find('.viewmap-link').parent().text();
        var index = response.indexOf("View");
        var title = $(data).find('#preview-local-title').text();
        var address = response.substr(0, index);
        var gurl =  'http://www.mapquestapi.com/geocoding/v1/address?&key=Fmjtd%7Cluur210blu%2Cb0%3Do5-90yxua&location=' + address;
        $.get(gurl, function(data){
          var loc = data.results[0].locations[0].latLng;
          var quality = data.results[0].locations[0].geocodeQuality;
          if (quality != 'CITY' && quality != 'COUNTRY' && quality != 'STATE') {
            var isIn = isInside(loc.lat, loc.lng);
            if (isIn == true) {
              var thing = {
                title: title,
                link : item,
                address: address
              }
              kj_items.push(thing);
            }
          }
          dfd.resolve();
        });
      });
    });
    $.when.apply($, dfds).done(function(){
      kj_listings_loaded.resolve();
    });
  });

  $.when(kj_listings_loaded).done(function(){
    console.log(kj_items);
    $.each(kj_items, function(index, item) {
      var li = $("<li>");
      var html = "<a target='_blank' href='" + item.link + "'>" + item.title + "</a>";
      li.html(html);
      list.append(li);
    });
  });

})();