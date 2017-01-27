var directionsDisplay = null;
var directionsService = null;
var pos = {};
function submitAction() {
  calculateAndDisplayRoute(directionsService, directionsDisplay);
}
function initMap() {
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsService = new google.maps.DirectionsService;
  var infoWindow = new google.maps.InfoWindow({map: map});
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: {lat: 37.77, lng:  -122.43}
  });
  directionsDisplay.setPanel(document.getElementById('right-panel'));
  directionsDisplay.setMap(map);

  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var startlatitude = pos.lat;
  var startlongitude = pos.lng;
  var end = document.getElementById("myForm").elements['end'].value;
  var shop = document.getElementById("myForm").elements['shop'].value;
  var transport = document.getElementById("myForm").elements['transport'].value;

  var stops = [];
  var options = document.getElementById('halts').getElementsByTagName('option');
  for(var i=0;i<options.length;i++){
    if(options[i].selected){
      stops.push({
        location : options[i].value,
        stopover : true
      });
    }
  }

  directionsService.route({
    origin: {
      lat: parseFloat(startlatitude),
      lng: parseFloat(startlongitude)
    },
    destination: end,
    waypoints : stops,
    travelMode: transport
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
