
$(function() {
    var locationMap;

    function getAddress() {
        var countryElement = $('select[name=country]').find(':selected');
        var regionElement = $('select[name=region]').find(':selected');
        var cityElement = $('select[name=city]').find(':selected');
        var street = $('input[name=street]').val().trim();
        var address = '';
        if (countryElement.val()) {
            address += ' ' + countryElement.text().trim();
            if (regionElement.val()) {
                address += ' ' + regionElement.text().trim();
                if (cityElement.val()) {
                    address += ' ' + cityElement.text().trim() + ' ' + street;
                }
            }
        }
        return address;
    }

    $('#usemap').on('click', function() {
        var $this = $(this);
        if ($this.is(':checked')) {
            $('.popin').show();
            GMaps.geocode({
                address: getAddress(),
                callback: function(results, status) {
                    if (status == 'OK') {
                        var latlng = results[0].geometry.location;
                        if (locationMap == undefined) {
                            locationMap = new GMaps({
                                div: '#map',
                                lat: latlng.lat(),
                                lng: latlng.lng()
                            });
                        } else {
                            locationMap.setCenter(latlng.lat(), latlng.lng());
                        }
                        $('input[name=lat]').val(latlng.lat());
                        $('input[name=lng]').val(latlng.lng());
                        locationMap.removeMarkers();
                        locationMap.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng(),
                            draggable: true,
                            dragend: function(e) {
                                $('input[name=lat]').val(e.latLng.k);
                                $('input[name=lng]').val(e.latLng.B);
                            }
                        });
                    }
                }
            });
        } else {
            $('.popin').hide();
        }
    });

    $('select[name=country]').on('change', function(e) {
        e.preventDefault();
        var selectedCountry = $(this).find(':selected').val();
        var $citySelect = $('select[name=city]');
        var $regionSelect = $('select[name=region]');
        $citySelect.empty();
        $citySelect.append('<option value="">Select City</option>');
        $citySelect.prop('disabled', true);
        $regionSelect.empty();
        $regionSelect.append('<option value="">Select Region</option>');

        if (selectedCountry === '') {
            $regionSelect.prop('disabled', true);
        } else {
            $.ajax({
                headers: {
                    Accept: 'application/json'
                },
                type: 'GET',
                url: '/regions/' + selectedCountry,
                success: function(data) {
                    $regionSelect.prop('disabled', false);
                    var regions = data.regions;
                    var len = regions.length;
                    for (var i = 0; i < len; i++) {
                        $regionSelect.append('<option value="' + regions[i].code + '">' + regions[i].name + '</option>');
                    }
                }
            });

        }
    });

    $('select[name=region]').on('change', function(e) {
        e.preventDefault();
        var $citySelect = $('select[name=city]');
        var selectedRegion = $(this).find(':selected').val();
        $citySelect.empty();
        $citySelect.append('<option value="">Select City</option>');

        if (selectedRegion === '') {
            $citySelect.prop('disabled', true);
        } else {
            $.ajax({
                headers: {
                    Accept: 'application/json'
                },
                type: 'GET',
                url: '/cities/' + selectedRegion,
                success: function(data) {
                    $citySelect.prop('disabled', false);
                    var cities = data.cities;
                    var len = cities.length;
                    for (var i = 0; i < len; i++) {
                        $citySelect.append('<option value="' + cities[i].code + '">' + cities[i].name + '</option>');
                    }
                }
            }); 
        }
    });

});
  