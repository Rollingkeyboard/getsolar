$(document).ready(function() {
 
// initial sunhours
var sunhours = 0.0
//initial PV Array system size
var systemsize = 0.0;

//Use defined variables
var address = "6652 Sleepy Meadow Ct."
var annualload = 6786;
var direction = 180
var mount = 0  // 0 = Rack mount , 1 = Roof mount
if (mount == 0)
var slope = 36 //latitude
else
    var slope = 20 //user defined by roof slope

// NREL solar url
var nrelURL = "https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=7pKM8EGimWnJ8PqI5BA8w2MhEoHyDNqCUSDBPmWn&address=" + address;

function requestJSON(url, callback) {
	$.ajax({
		url:url,
		complete: function(xhr) {
			callback.call(null, xhr.responseJSON);
		}
	});
}

requestJSON(nrelURL, function(json) {
  console.log(json);
  var nrel_sun_hours = json.outputs.avg_lat_tilt.annual;

  //Young PV Array Calculations
  sunhours = nrel_sun_hours;
  console.log('sunhours from NREL ' + sunhours);
  systemsize = (((annualload/365)/sunhours)/.78);
  console.log('PV Array system size is ' + systemsize);
  
  /* get PV Array info via JSON */
  $.getJSON("https://developer.nrel.gov/api/pvwatts/v5.json?api_key=7pKM8EGimWnJ8PqI5BA8w2MhEoHyDNqCUSDBPmWn&address="+address+"&dataset=tmy3&system_capacity="+systemsize+"&azimuth="+direction+"&tilt="+slope+"&array_type="+mount+"&module_type=1&inv_eff=98&losses=10", function(data) { 
    console.log(data);// intialize list
  });
})


});


