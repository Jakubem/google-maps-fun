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
    marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'drag',
        draggable: true,
    });

    getPositionBtn.addEventListener('click', getMyLatLng);
    setPositionBtn.addEventListener('click', setNewPoint);

    function getMyLatLng() {
        let lat = marker.getPosition().lat();
        let lng = marker.getPosition().lng();
        positionOutput.innerHTML = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
    }

    function setNewPoint() {
        let newLatLng = {
            lat: Number(latInput.value),
            lng: Number(lngInput.value)
        }
        return new google.maps.Marker({
            position: newLatLng,
            map: map,
            title: 'drag',
            draggable: true,
        })
    }
}