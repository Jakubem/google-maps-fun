let map;

const socket = io('http://localhost:5500');

const latInput = document.querySelector('.lat-input');
const lngInput = document.querySelector('.lng-input');
const setPositionBtn = document.querySelector('.set-position-btn');
const getPositionBtn = document.querySelector('.get-position-btn');
const positionOutput = document.querySelector('.position-output');

socket.on('news', (data) => {
    console.log('Backend says', data);
    socket.emit('hello');
  });

function initMap() {
    let myLatLng = {
            lat: 53.36552,
            lng: 14.64999
        },
        map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 19,
            mapTypeId: 'satellite',
            draggableCursor: 'crosshair',
        });
        
        // add marker on click
        map.addListener('click', (e)=> {
            placeMarker(e.latLng);
        });
        
        let markers = [];
        function placeMarker(position) {
            let marker = new google.maps.Marker({
                position: position,
                map: map,
                draggable: true
            });
            let lat = marker.getPosition().lat();
            let lng = marker.getPosition().lng();
            console.log(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
            
            markers.push(`{"lat": ${lat},"lng": ${lng}}`);
        }

    getPositionBtn.addEventListener('click', getMyLatLng);

    function getMyLatLng(){
        const markersToJSON = markers.map((marker)=>{
            return JSON.parse(marker)
        })
        
        const allPins = {
            "pins": markersToJSON,
        }
        console.log(allPins);
    }

    setPositionBtn.addEventListener('click', setNewPoint);
    function setNewPoint(){
        return new google.maps.Marker({
            position: {
                lat: Number(latInput.value),
                lng: Number(lngInput.value)
            },
            map: map,
            draggable: true
        });
    }
}