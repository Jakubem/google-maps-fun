// input for setting lattitude by the user
const latInput = document.querySelector('.lat');

// input for setting langitude by the user
const lngInput = document.querySelector('.lng');

// buton which will center the google maps upon clicking
const centerMapBtn = document.querySelector('.center-map-btn');

// output for dragged marker position
const draggedPos = document.querySelector('.dragged-pos');

// button for logging position of all markers
const getPositionBtn = document.querySelector('.get-position-btn');

// button which will remove last marker
const removeMarkerBtn = document.querySelector('.remove-marker-btn');

// create socket connection
const socket = io('http://localhost:5500');

socket.on('connectionEstablished', (data) => {
  console.log(data);
})

/**
 * built-in Google Maps function for initializing new map instance
 */
function initMap() {
  let myLatLng = {
    lat: 53.3655,
    lng: 14.6499
  };

  //initialize new google map instance
  let map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 18,
    mapTypeId: 'satellite',
    draggableCursor: 'crosshair',

    // change default ui layout
    rotateControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    zoomControl: false,
    scaleControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  /* CENTER MAP ON INPUTS POSITION */
  centerMapBtn.addEventListener('click', () => {
    let latLng = {
      lng: Number(lngInput.value),
      lat: Number(latInput.value)
    };
    centerMap(latLng);
  });

  /**
   * This function will center the map on coordinates from lngInput and latInput
   * @param {object} pos - latLng
   */
  function centerMap(pos) {
    map.setCenter(pos);
  }

  /* MARKERS CREATION */

  // load markers from previous session via socket.io
  let session = [];
  socket.on('session', (data) => {
    session.push(JSON.parse(data));
    // console.log(data.features);
    console.log(session[0].features);
  })

  // loop through GeoJSON to get coordinates of each marker from previous session

  // add marker on click
  map.addListener('click', (e) => {
    placeMarker(e.latLng);
  });
  //create empty array for all created markers
  let markers = [];

  /**
   * this function will create new marker based on click position
   * @param {object} pos - latLng of click event on map
   */
  function placeMarker(pos) {
    let marker = new google.maps.Marker({
      position: pos,
      map: map,
      draggable: true,
      // set title based on initial position for each marker
      title: String(`${pos.lng().toFixed(5)}, ${pos.lat().toFixed(5)}`),
      icon: './assets/img/pin.png',
      // set custom property on marker
      customData: {
        'hops': 'data',
        'siups': 'another-data',
        'hyc': 'slightly-different-data',
        'bum': 'totally-different-data',
        'tsz': 'mango'
      }
    });

    // push each created marker to markers array
    markers.push(marker)

    /* DRAG MARKER TO SHOW CURRENT LatLng */

    // add drag event to each marker
    marker.addListener('drag', () => {
      // set transparency on marker on hover
      marker.setOpacity(0.6);
      // https://stackoverflow.com/questions/44140055/getting-draggable-marker-position-lat-lng-in-google-maps-react
      let lng = marker.getPosition().lng().toFixed(5);
      let lat = marker.getPosition().lat().toFixed(5);
      // reset transform and opacity position of dragged-pos element
      draggedPos.style.transform = 'none';
      // render current marker position into dragged-pos element
      draggedPos.innerHTML = `lng: ${lng}, lat: ${lat}`;
    });
    // set styles to default
    marker.addListener('dragend', () => {
      marker.setOpacity(1);
      draggedPos.style.transform = 'translate(0, 50px)';
      // update title of each marker
      let lng = marker.getPosition().lng().toFixed(5);
      let lat = marker.getPosition().lat().toFixed(5);
      marker.setTitle(String(`${lng}, ${lat}`));
    });

    // remove marker on click
    marker.addListener('click', (i) => {
      marker.setMap(null);
      markers.splice(i, 1);
    });

    /* MARKERS REMOVAL */

    // remove single marker
    removeMarkerBtn.addEventListener('click', () => {
      // pass length of markers array reduced by 1 to removeMarker function
      markers.forEach((el, i, arr) => {
        el.setMap(null);
      })
      markers = [];
    })
  }

  /* SEND MARKERS ARRAY TO BACKEND */
  getPositionBtn.addEventListener('click', getMyLatLng);

  // get position of each marker as JSON

  /**
   * This function will create array with lat and lng of each marker
   */
  function getMyLatLng() {
    // create empty markersPosition array or reset existing one
    markersPosition = [];
    // loop through all created markers...
    markers.forEach((el) => {
      // ...and get each marker position
      let lng = el.getPosition().lng();
      let lat = el.getPosition().lat();
      // get custom data from each marker
      let customProps = el.customData;
      // push position of each marker in GeoJSON format to empty markersPosition array
      markersPosition.push({
        "type": "Feature",
        "properties": {
          customProps
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            lng,
            lat
          ]
        }
      });
    });

    // create new GeoJSON object with all pins
    const allPins = {
      "type": "FeatureCollection",
      "features": markersPosition,
    };

    // check if there are any pins to send...
    if (allPins.features.length !== 0) {
      console.log(`send to backend: ${JSON.stringify(allPins)}`);
      // ... if so, send pins positions to backend as JSON
      socket.emit('pins', JSON.stringify(allPins, null, 2));
    } else {
      console.log('nothing to send')
    }
  }
}