$(document).ready(solarReady);

var chart;

function solarReady() {
    // handle infromative popover fucntions
    $('[data-toggle="popover"]').popover();

    $('body').on('click', function(e) {
        //only buttons
        if ($(e.target).data('toggle') !== 'popover' &&
            $(e.target).parents('.popover.in').length === 0) {
            $('[data-toggle="popover"]').popover('hide');
        }
    });
    $('body').popover({
        selector: '[rel=popover]',
        trigger: "click"
    }).on("show.bs.popover", function(e) {
        // hide all other popovers
        $("[rel=popover]").not(e.target).popover("destroy");
        $(".popover").remove();
    });
    // handle infromative popover fucntions


    $('#pv').submit(function(e) {
        e.preventDefault();

        var sunhours = 0.0, // initial sunhours
            systemsize = 0.0; //initial PV Array system size

        var formData = getFormData($(this));

        var elecRate = formData.elecRatePerKWH || false;

        // check if address is valid
        var str_address = formData.address;
        var split_address = str_address.split(",");
        var address_validation = validateAddress(split_address);
        if (address_validation == false) {
            formData.address = false;
            $('.jumbotron').children().eq(2).addClass("has-danger");
        } else {
            $('.jumbotron').children().eq(2).removeClass("has-danger");
        }
        console.log(formData.address);

        // if(formData.address == '6412 Burgundy way'){
        //   formData.address = false;
        // }

        if (formData.address && formData.annualElecUsage && formData.mounting && formData.mountDirection) {

            $('#submit').val('Loading...').attr('disabled', true);


            var address = formData.address || '4505 S Maryland Pkwy, Las Vegas, NV 89154';
            var annualload = formData.annualElecUsage || 6786;
            var direction = formData.mountDirection || 180;

            var mount = formData.mounting; // 0 = Ground mount , 1 = Roof mount

            if (mount == 0)
                var slope = 36
            else
                var slope = 20 //user defined by roof slope

            // NREL solar url
            var solarResource = "https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=7pKM8EGimWnJ8PqI5BA8w2MhEoHyDNqCUSDBPmWn&address=" + address;
            var utilityRates = "https://developer.nrel.gov//api/utility_rates/v3.json?api_key=7pKM8EGimWnJ8PqI5BA8w2MhEoHyDNqCUSDBPmWn&address=" + address;

            $.getJSON(solarResource, function(solarData) {
                var nrel_sun_hours = solarData.outputs.avg_lat_tilt.annual;

                // Yung PV Array Calculations
                sunhours = nrel_sun_hours;
                // console.log('Sunhours from NREL ' + sunhours);

                systemsize = (((annualload / 365) / sunhours) / .78);
                systemcost = (systemsize * 3290) //system size * cost per(kw)
                    // console.log('PV Array system size is ' + systemsize);

                var pvWatts = "https://developer.nrel.gov/api/pvwatts/v5.json?api_key=7pKM8EGimWnJ8PqI5BA8w2MhEoHyDNqCUSDBPmWn&address=" + address + "&dataset=tmy3&system_capacity=" + systemsize + "&azimuth=" + direction + "&tilt=" + slope + "&array_type=" + mount + "&module_type=1&inv_eff=98&losses=10"

                // get PV Array info via JSON
                $.getJSON(pvWatts, function(pvData) {
                    //get utility rate information via JSON
                    $.getJSON(utilityRates, function(utilityData) {
                        if (!formData.elecRatePerKWH) {
                            elecRate = Math.floor(utilityData.outputs.residential * 100) / 100
                            $('#elecRatePerKWH').attr('placeholder', elecRate);
                        }
                        //output pv and finicial informaiton form system the the web-browser
                        $('#output .capacity').text(Math.ceil(pvData.inputs.system_capacity * 10) / 10);
                        $('#output .production').text(Math.floor(pvData.outputs.ac_annual));
                        $('#output .earnings').text(Math.floor(pvData.outputs.ac_annual * elecRate));

                        $('#output .withSystem').text(
                            Math.ceil(
                                ((formData.annualElecUsage * elecRate) - (pvData.outputs.ac_annual * elecRate)) * 1
                            ) / 1
                        );
                        $('#output .withoutSystem').text(
                            Math.ceil(
                                (formData.annualElecUsage * elecRate) * 1
                            ) / 1
                        );

                        $('#output .systemcost').text(
                            Math.ceil(systemcost)
                        );
                        $('.systemcost, .withSystem, .withoutSystem, .earnings').formatCurrency();

                        $('#output .payback').text(
                            Math.ceil(systemcost / (pvData.outputs.ac_annual * elecRate))
                        );

                        $('#output').css({
                            'opacity': 1
                        });
                        $('#submit').val('Recalculate Size').attr('disabled', false);
                    });

                });
            });

        }
    });
}

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function requestJSON(url, callback) {
    $.ajax({
        url: url,
        complete: function(xhr) {
            callback.call(null, xhr.responseJSON);
        }
    });
}