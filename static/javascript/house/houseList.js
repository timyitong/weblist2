$(function() {
    var locationMap;

    // Load location map.
    $.ajax({
        headers: {
            Accept: 'application/json'
        },
        type: 'GET',
        url: '/houses',
        success: function(data) {
            var houses = data.houses;
            var len = houses.length;
            var midLat = 0;
            var midLng = 0;
            var houseGeos = [];
            for (var i = 0; i < len; i++) {
                if (houses[i].geoLocation != undefined) {
                    houseGeos.push(houses[i]);
                    midLat += parseFloat(houses[i].geoLocation.lat);
                    midLng += parseFloat(houses[i].geoLocation.lng);
                }
            }
            midLat = midLat / houseGeos.length;
            midLng = midLng / houseGeos.length;
            locationMap = new GMaps({
                div: '#map',
                lat: midLat,
                lng: midLng
            });
            var len = houseGeos.length;
            for (var i = 0; i < len; i++) {
                locationMap.addMarker({
                    lat: houseGeos[i].geoLocation.lat,
                    lng: houseGeos[i].geoLocation.lng
                });
            }
        }
    });
});