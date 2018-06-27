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

function initMap() {
  let myLatLng = {
    lat: 53.3655,
    lng: 14.6499
  };

  //initialize new google map instance
  let map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 20,
    mapTypeId: 'satellite',
    draggableCursor: 'crosshair',
  });

  /* CENTER MAP ON INPUTS POSITION */
  centerMapBtn.addEventListener('click', () => {
    let latLng = {
      lat: Number(latInput.value),
      lng: Number(lngInput.value)
    };

    centerMap(latLng);
  });


  function centerMap(pos) {
    map.setCenter(pos);
  }

  /* MARKERS CREATION */

  // add marker on click
  map.addListener('click', (e) => {
    placeMarker(e.latLng);
  });
  //create empty array for all created markers
  let markers = [];
  // create marker based on click position
  function placeMarker(pos) {
    
    let marker = new google.maps.Marker({
      position: pos,
      map: map,
      draggable: true,
      // set title based on initial position for each marker
      title: String(`${pos.lat().toFixed(5)}, ${pos.lng().toFixed(5)}`),
      icon: './assets/img/pin.png',
    });

    // push each created marker to markers array
    markers.push(marker)

    /* DRAG MARKER TO SHOW CURRENT LatLng */

    // add drag event to each marker
    marker.addListener('drag', function () {
      // https://stackoverflow.com/questions/44140055/getting-draggable-marker-position-lat-lng-in-google-maps-react
      let lat = marker.getPosition().lat();
      let lng = marker.getPosition().lng();
      // reset transform and opacity position of dragged-pos element
      draggedPos.style.transform = 'none';
      draggedPos.style.opacity = '1';
      // render current marker position into dragged-pos element
      draggedPos.innerHTML = `lat: ${lat.toFixed(5)}, lng: ${lng.toFixed(5)}`;
    });
    // set styles to default
    marker.addListener('dragend', function () {
      draggedPos.style.transform = 'translate(-280px)';
      draggedPos.style.opacity = '0';
    });
  }

  /* MARKERS REMOVAL */

  // add keyboard shortcut to remove last marker
  window.addEventListener('keypress', (ev) => {

    // check code of pressed key
    if (ev.ctrlKey && ev.key === 'z') {
      removeMarker(markers.length - 1);
    }
  })
  // remove single marker
  removeMarkerBtn.addEventListener('click', () => {
    // pass length of markers array reduced by 1 to removeMarker function
    removeMarker(markers.length - 1);
  })

  /**
   * This function removes a marker
   * @param { Number } i index of marker to remove  
   */
  function removeMarker(i) {
    if (markers.length > 0) {
      // remove single google maps marker
      markers[i].setMap(null);
      // remove ^ marker object from markers array
      markers.splice(i, 1);
    } else {
      console.log('nothing to remove');
    }
  }

  /* SEND MARKERS ARRAY TO BACKEND */
  getPositionBtn.addEventListener('click', getMyLatLng);
  // get position of each marker as JSON
  function getMyLatLng() {
    // create empty markersPosition array or reset existing one
    markersPosition = [];
    // loop through all created markers...
    markers.forEach((el) => {
      // ...and get each marker position
      let lat = el.getPosition().lat();
      let lng = el.getPosition().lng();
      // push position of each marker to empty markersPosition array
      markersPosition.push({
        lat,
        lng
      });
    });

    // create array for all pins
    const allPins = {
      'pins': markersPosition,
    };

    // check if there are any pins to send...
    if (allPins.pins.length !== 0) {
      console.log(`send to backend: ${JSON.stringify(allPins)}`);
      // ... if so, send pins positions to backend as JSON
      socket.emit('pins', JSON.stringify(allPins, null, 2));
    } else {
      console.log('nothing to send')
    }
  }
}