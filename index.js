let map;

const latInput = document.querySelector('.lat-input');
const lngInput = document.querySelector('.lng-input');
const submitBtn = document.querySelector('.submit-btn');
const latOutput = document.querySelector('.lat-output');
const lngOutput = document.querySelector('.lng-output');

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
    submitBtn.addEventListener('click', getMyLatLng)


    function getMyLatLng() {
        let lat = marker.getPosition().lat();
        let lng = marker.getPosition().lng();
        console.log('Latitude: ' + lat);
        console.log('Longitude: ' + lng);
    }
}