// pass in the address array
function validateAddress(arr) {
	console.log(arr);

	// tokenize first element
	split_street = arr[0].split(" ");
	// check to see if there is a street number
	if(isNaN(split_street[0])) {
		return false;
	}

	// find the zipcode and validate
	var zip;
	if(arr.length > 1) {
		var findZip = arr[arr.length-1];
		var getZip = findZip.split(" ");
		var zip = getZip[getZip.length-1];
		//check zipcode is a number
		if(isNaN(zip)) {
			return false;
		}
	} else {
		zip = split_street[split_street.length-1];
		// check if zipcode is a number
		if(isNaN(zip)) {
			return false;
		}
	}
	// if its all valid return true
	return true;
}