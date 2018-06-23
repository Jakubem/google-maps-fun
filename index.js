let map;

const latInput = document.querySelector('.lat-input');
const lngInput = document.querySelector('.lng-input');
const setPositionBtn = document.querySelector('.set-position-btn');
const getPositionBtn = document.querySelector('.get-position-btn');
const positionOutput = document.querySelector('.position-output');

function initMap() {
    let myLatLng = {
            lat: 53.5,
            lng: 14.4
        },
        map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 10,
            mapTypeId: 'satellite',
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
            
            markers.push(`{"lat": ${lat}, "lng": ${lng}}`);
        }

    getPositionBtn.addEventListener('click', getMyLatLng);

    function getMyLatLng(){
        const markers2 = markers.map((marker)=>{
            // console.log(marker);
            return JSON.parse(marker)
        })
        markers2.forEach((marker)=>{
            console.log(marker);
        })
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