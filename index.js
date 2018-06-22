let map;

const latInput = document.querySelector('.lat-input');
const lngInput = document.querySelector('.lng-input');
const setPositionBtn = document.querySelector('.set-position-btn');
const getPositionBtn = document.querySelector('.get-position-btn');
const positionOutput = document.querySelector('.position-output');

function initMap() {
    let myLatLng = {
            lat: -34.397,
            lng: 150.644
        },
        map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 8,
            mapTypeId: 'satellite',
        });
    marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'drag',
        draggable: true,
    });
    getPositionBtn.addEventListener('click', getMyLatLng);

    function getMyLatLng() {
        let lat = marker.getPosition().lat();
        let lng = marker.getPosition().lng();
        positionOutput.innerHTML = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
    }
}