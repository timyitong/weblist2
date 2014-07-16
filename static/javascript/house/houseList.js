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
            if (houses.length) {
                var len = houses.length;
                var midLatitude = 0;
                var midLongitude = 0;
                var houseGeos = [];
                for (var i = 0; i < len; i++) {
                    if (houses[i].geoLocation != undefined) {
                        houseGeos.push(houses[i]);
                        midLatitude += parseFloat(houses[i].geoLocation.latitude);
                        midLongitude += parseFloat(houses[i].geoLocation.longitude);
                    }
                }
                if (houseGeos.length) {
                    midLatitude = midLatitude / houseGeos.length;
                    midLongitude = midLongitude / houseGeos.length;
                    locationMap = new GMaps({
                        div: '#map',
                        lat: midLatitude,
                        lng: midLongitude
                    });
                    var len = houseGeos.length;
                    for (var i = 0; i < len; i++) {
                        locationMap.addMarker({
                            lat: houseGeos[i].geoLocation.latitude,
                            lng: houseGeos[i].geoLocation.longitude
                        });
                    }
                }
            }
        }
    });
});