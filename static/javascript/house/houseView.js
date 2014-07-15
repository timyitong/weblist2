$(function() {
    var locationMap;

    // Load location map.
    $.ajax({
        headers: {
            Accept: 'application/json'
        },
        type: 'GET',
        url: '/house/' + getHouseId(),
        success: function(data) {
            var geoLocation = data.house.geoLocation;
            locationMap = new GMaps({
                div: '#map',
                lat: geoLocation.lat,
                lng: geoLocation.lng
            });
            locationMap.addMarker({
                lat: geoLocation.lat,
                lng: geoLocation.lng
            });
        }
    });

    function getHouseId() {
        var urlPathnames = window.location.pathname.split('/');
        return urlPathnames[urlPathnames.length - 1];
    }
});