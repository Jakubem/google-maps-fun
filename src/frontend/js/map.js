const socket = require('./socket.js').socket;
const strToObj = require('./string.js').strToObj;
const objToStr = require('./string.js').objToStr;

// input for setting lattitude by the user
const latInput = document.querySelector('.text-input__lat');

// input for setting langitude by the user
const lngInput = document.querySelector('.text-input__lng');

// buton which will center the google maps upon clicking
const centerMapBtn = document.querySelector('.btn__center-map');

// output for dragged marker position
const draggedPos = document.querySelector('.dragged-pos');

// button for logging position of all markers
const getPositionBtn = document.querySelector('.btn__get-position');

// button which will remove last marker
const removeMarkerBtn = document.querySelector('.btn__remove-marker');

// get radio fields
const radioValues = document.getElementsByName('edit-mode');

// textarea for inputing marker properties
const propsTextarea = document.querySelector('#textarea-marker-props');

// button for submitting props from propsTextarea
const propsBtn = document.querySelector('.btn__add-marker-props');

// button for clearing active state from markers
const rmActiveBtn = document.querySelector('.btn__remove-active-state');

// output for displaying marker properties
const eventOutput = document.querySelector('.output-event');

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
  // get data from backend
  socket.on('session', (data) => {
    if (data === '') {
      eventOutput.innerHTML = 'no previous session to load';
      return;
    } else
      session.push(JSON.parse(data));
    // get markers from GeoJSON
    session[0].features.forEach((el) => {
      // create new googlemaps LatLng object (in GeoJSON lng is first)
      let pos = new google.maps.LatLng(el.geometry.coordinates[1], el.geometry.coordinates[0]);
      // get properties from GeoJSON
      let props = el.properties;
      placeMarker(pos, props);
    });
  })

  // loop through GeoJSON to get coordinates of each marker from previous session

  // add marker on click
  map.addListener('click', (e) => {
    // check if "place marker" radio is checked
    if (radioValues[0].checked) {
      placeMarker(e.latLng, {});
    }
  });
  //create empty array for all created markers
  let markers = [];

  /**
   * this function will create new marker based on click position
   * @param {object} pos - latLng of click event on map (custom google maps object with lng() and lat() methods)
   * @param {object} props - custom properties from GeoJSON
   */
  function placeMarker(pos, props) {
    let marker = new google.maps.Marker({
      position: pos,
      map: map,
      draggable: true,
      // set title based on initial position for each marker
      title: String(`${pos.lng().toFixed(5)}, ${pos.lat().toFixed(5)}`),
      icon: './pin.png',
      // set custom property on marker
      customData: props,
    });

    // push each created marker to markers array
    markers.push(marker)

    /* DRAG MARKER TO SHOW CURRENT LatLng */

    // add drag event to each marker
    marker.addListener('drag', () => {
      // set transparency on marker on drag
      marker.setOpacity(0.4);
      // https://stackoverflow.com/questions/44140055/getting-draggable-marker-position-lat-lng-in-google-maps-react
      let lng = marker.getPosition().lng().toFixed(5);
      let lat = marker.getPosition().lat().toFixed(5);
      // reset transform and opacity position of dragged-pos element
      draggedPos.style.opacity = '1';
      // render current marker position into dragged-pos element
      draggedPos.innerHTML = `lng: ${lng}, lat: ${lat}`;
    });
    // set styles to default
    marker.addListener('dragend', () => {
      marker.setOpacity(1);
      draggedPos.style.opacity = '0';
      // update title of each marker
      let lng = marker.getPosition().lng().toFixed(5);
      let lat = marker.getPosition().lat().toFixed(5);
      marker.setTitle(String(`${lng}, ${lat}`));
    });

    /* INFO WINDOW */
    let content = JSON.stringify(marker.customData)
    let infowindow = new google.maps.InfoWindow({
      content: content,
    });

    /**
     * function that opens infowindow on hover
     * 
     */
    function openInfowindow() {
      infowindow.open(map, marker);
    }
    /**
     * function that closes infowindow on mouseout
     * 
     */
    function closeInfowindow() {
      infowindow.close(map, marker);
    }

    /* open infowindow on mouseover and close it on mouseout */
    marker.addListener('mouseover', () => {
      if (radioValues[1].checked) {
        openInfowindow();
      }
    })
    marker.addListener('mouseout', () => {
      if (radioValues[1].checked) {
        closeInfowindow();
      }
    })

    // perform action on marker depending in radio state
    marker.addListener('click', (i) => {
      switch (true) {
        // "place marker" radio is selected
        case radioValues[0].checked:
          break;

          // "edit marker" radio is selected
        case radioValues[1].checked:
          // set icon for active state
          let icon = './pin--active.png';
          marker.setIcon(icon);
          // get custom properties from existing markers
          let markerProps = JSON.stringify(marker.customData);
          // output props in textarea and eventOutput
          eventOutput.innerHTML = markerProps;
          propsTextarea.value = markerProps;

          propsBtn.addEventListener('click', () => {
            setCustomProps();
          }, true);

          // propsBtn.addEventListener('click', setCustomProps, true);
          function setCustomProps() {
            // add data from propsTextarea 
            marker.customData = JSON.parse(propsTextarea.value);
            marker.setIcon('./pin.png')
            propsBtn.removeEventListener('click', setCustomProps, true);
          }
          rmActiveBtn.addEventListener('click', () => {
            propsBtn.removeEventListener('click', setCustomProps, true);
            // set icon for normal state
            marker.setIcon('./pin.png')
            propsTextarea.value = '';
            eventOutput.innerHTML = '';
          })
          break;

          // "place marker" radio is selected
        case radioValues[2].checked:
          marker.setMap(null);
          markers.splice(i, 1);
          break;
      }
    });

    /* MARKERS REMOVAL */

    // remove all markers
    removeMarkerBtn.addEventListener('click', () => {
      markers.forEach((el, i, arr) => {
        // remove google map markers
        el.setMap(null);
      })
      // reset markers array
      markers = [];
    })
  }

  /* SEND MARKERS ARRAY TO BACKEND */
  getPositionBtn.addEventListener('click', getMyLatLng);

  // get position of each marker as GeoJSON

  /**
   * This function will create array with lat and lng of each marker
   */
  function getMyLatLng() {
    // create empty markersPosition array or reset existing one
    let markersPosition = [];
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
        "properties": customProps,
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
      console.log(`${JSON.stringify(allPins, null, 2)}`);
      eventOutput.innerHTML = 'send pins to backend'
      // ... if so, send pins positions to backend as JSON
      socket.emit('pins', JSON.stringify(allPins, null, 2));
    } else {
      eventOutput.innerHTML = 'session cleared'
      socket.emit('pins', '');
    }
  }
}
// add initMap to global scope (https://stackoverflow.com/questions/40575637/how-to-use-webpack-with-google-maps-api)
window.initMap = initMap;

export {initMap};