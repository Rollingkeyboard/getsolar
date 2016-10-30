$(document).ready(function() {
 
sunhours = 6.7 //currently a constant but will be retrieved using NREL data retrievel tool

//Use defined variables
var address = "6652 Sleepy Meadow Ct."
var direction = 180
var mount = 0  // 0 = Rack mount , 1 = Roof mount
if (mount == 0)
var slope = 36 //latitude
else
    var slope = 20 //user defined by roof slope

//Function to retrieve annual sun hours/avg
// function getSunhrs(){
//      $.getJSON("https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=7pKM8EGimWnJ8PqI5BA8w2MhEoHyDNqCUSDBPmWn&address=" + address, function(data) { 
//         console.log(data);// intialize list
//         console.log(data.outputs.avg_lat_tilt.annual);
//       });
// }
// getSunhurs();

var annualload = 6786
//Young PV Array Calculations
console.log("sunhours = " + sunhours)
var systemsize = (((annualload/365)/sunhours)/.78)



  /* get PV Array info via JSON */
  $.getJSON("https://developer.nrel.gov/api/pvwatts/v5.json?api_key=7pKM8EGimWnJ8PqI5BA8w2MhEoHyDNqCUSDBPmWn&address="+address+"&dataset=tmy3&system_capacity="+systemsize+"&azimuth="+direction+"&tilt="+slope+"&array_type="+mount+"&module_type=1&inv_eff=98&losses=10", function(data) { 
    console.log(data);// intialize list
  });
});


