let map;

const latInput = document.querySelector('.lat-input');
const lngInput = document.querySelector('.lng-input');
const getPositionBtn = document.querySelector('.get-position-btn');
const removeMarkerBtn = document.querySelector('.remove-marker-btn');

// create socket connection
const socket = io('http://localhost:5500');

socket.on('connectionEstablished', (data)=>{
    console.log(data);
})

function initMap() {
    let myLatLng = {
            lat: 53.36552,
            lng: 14.64999
        },

        //initialize new google map instance
        map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 19,
            mapTypeId: 'satellite',
            draggableCursor: 'crosshair',
        });

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
                // icon: './assets/img/pin.png',
            },
        );

        // push each created marker to markers array
        markers.push(marker)
    }

    // remove single marker
    removeMarkerBtn.addEventListener('click', ()=>{
        markers[2].setMap(null);
    })

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
            markersPosition.push(JSON.parse(`{"lat": ${lat},"lng": ${lng}}`));
        })

        const allPins = {
            "pins": markersPosition,
        }
        // socket.emit('pins', allPins)
        socket.emit('pins', JSON.stringify(allPins, null, 2))
        console.log('send to backend: ' + JSON.stringify(allPins));
    }
}