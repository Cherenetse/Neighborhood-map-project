// Array of Data
var locations = [
  {name: 'Yod Abyssinia Restaurant',
  address: 'Cameroon St , Addis Ababa Ethiopia',
  website: 'https://www.tripadvisor.com/Restaurant_Review-g293791-d1477419-Reviews-Yod_Abyssinia_Traditional_Food-Addis_Ababa.html',
  latitude: 8.991078,
  longitude: 38.793497,
  marker: '',
  },
  {name: 'Lucy Lounge and Restaurant',
  address: '5 killo , Addis Ababa , Ethiopia',
  website: 'https://www.tripadvisor.com/Restaurant_Review-g293791-d2085725-Reviews-Lucy_Lounge_Restaurant-Addis_Ababa.html',
  latitude: 9.038402,
  longitude: 38.761729,
  marker: ''
  },
  {name: 'Habesha 2000 Restaurant',
  address: 'Namibia Street  , Addis Ababa , Ethiopia',
  website: 'https://www.tripadvisor.com/Restaurant_Review-g293791-d1213326-Reviews-Habesha_Restaurant-Addis_Ababa.html',
  latitude: 9.001506,
  longitude: 38.781824,
  marker: ''
  },
  {name: 'Yeshi Buna',
  address: 'Jomo Kenyatta Street ,Addis Ababa , Ethiopia',
  website: 'https://www.tripadvisor.com/Restaurant_Review-g3332004-d8771195-Reviews-Yeshi_Buna-Moorooka_Brisbane_Region_Queensland.html',
  latitude: 9.009856,
  longitude: 38.771245,
  marker: ''
  },
  {name: 'Adot Tina',
  address: 'Addis Ababa , Ethiopia',
  website: 'https://www.tripadvisor.com/Hotel_Review-g293791-d1139080-Reviews-Adot_Tina_Hotel-Addis_Ababa.html',
  latitude: 8.991375,
  longitude: 38.767040,
  marker: ''
  },
  {name: 'Teshomech Kitfo ',
  address: 'Ethio-China St ,Addis Ababa , Ethiopia',
  latitude: 8.991470,
  longitude: 38.773488,
  marker: ''
  },

  {name: 'Rodeo Restaurant ',
  address: 'Addis Ababa , Ethiopia',
  website :'https://www.tripadvisor.com/Restaurant_Review-g293791-d2411553-Reviews-Rodeo_Addis-Addis_Ababa.html',
  latitude: 8.995932,
  longitude: 38.773638,
  marker: ''
  },
  {name: 'Totot cultural Restaurant ',
  address: 'Ethio-China St ,Addis Ababa , Ethiopia',
  website: 'https://www.tripadvisor.com/Restaurant_Review-g293791-d8736886-Reviews-Totot-Addis_Ababa.html',
  latitude: 9.007185,
  longitude: 38.806243,
  marker: ''
  },
  {name: 'Ras Hotel ',
  address: 'Gambia St ,Addis Ababa , Ethiopia',
  website: '',
  latitude: 9.014889,
  longitude: 38.752352,
  marker: ''
  },
  {name: 'Finfine Adarash Hotel ',
  address: 'Addis Ababa , Ethiopia',
  website: 'https://www.tripadvisor.com/Restaurant_Review-g293791-d6784238-Reviews-FinFine_Restaurant-Addis_Ababa.html',
  latitude: 9.017485,
  longitude: 38.758575,
  marker: ''
  },

];

//Place constructor uses ko.observable so view is automatically updated
var Place = function (data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.website = ko.observable(data.website);
  this.latitude = ko.observable(data.latitude);
  this.longitude = ko.observable(data.longitude);
  this.marker = '';
};

/**View Model**/
function initMap () {
  var viewModel = function () {
    //Self alias provides lexical scope
    var self = this;
    //Center map on Tampa, FL
    var mapOptions = {
      zoom: 14,
      center: {lat: 9.009856, lng: 38.771245}
    };

    map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

    //Resize map when window is resized
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });

    //Create observable array of markers
    self.markerArray = ko.observableArray(locations);
    //Set flag
    var openedInfoWindow = null;

    //Create markers for each location
    self.markerArray().forEach(function(placeItem) {
      contentString = ' ';
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(placeItem.latitude, placeItem.longitude),
        map: map,
        title: placeItem.name,
        link: placeItem.website,
        animation: google.maps.Animation.DROP
      });
      placeItem.marker = marker;

      //Add bounce animation to markers
      placeItem.marker.addListener('click', toggleBounce);
      function toggleBounce() {
        if (placeItem.marker.getAnimation() !== null) {
          placeItem.marker.setAnimation(null);
        } else {
          placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ placeItem.marker.setAnimation(null); }, 2100);
        }
      }

      //Create variables for use in contentString
      var windowNames = placeItem.name;
      var windowWebsite = placeItem.website;
      var windowAddresses = placeItem.address;

      //Create new infowindow
      var infoWindow = new google.maps.InfoWindow({content: contentString});
      //Open infoWindow when marker is clicked

      google.maps.event.addListener(placeItem.marker, 'click', function() {
        //Use encodeURI method to replace symbols and spaces with UTF-8 encoding of character
        var formatName = encodeURI(placeItem.name);



    //Connect marker to list selection
    self.markerConnect = function(marker) {
      google.maps.event.trigger(this.marker, 'click');
    };

    //Make filter search input an observable
    self.query= ko.observable('');

    //ko.computed is used to filter and return items that match the query string input by users
    self.filteredPlaces = ko.computed(function(placeItem) {
      var filter = self.query().toLowerCase();
      //If searchbox empty return the full list and set all markers visible
      if (!filter) {
        self.markerArray().forEach(function(placeItem) {
          placeItem.marker.setVisible(true);
        });
        return self.markerArray();
      //Else use startsWith to compare search term to list and make visible those that match
      } else {
        return ko.utils.arrayFilter(self.markerArray(), function(placeItem) {
          searchTerm = strStartsWith(placeItem.name.toLowerCase(), filter);
          placeItem.marker.setVisible(false);
            if (searchTerm) {
              placeItem.marker.setVisible(true);
              return searchTerm;
            }
        });
      }
    }, self);

    var strStartsWith = function (string, startsWith) {
      string = string || "";
      if (startsWith.length > string.length) {
        return false;
      }
      return string.substring(0, startsWith.length) === startsWith;
    };

  };
  //Call the viewModel function
  ko.applyBindings(new viewModel());
}