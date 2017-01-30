var map = L.map('mapid', {
	center: [38.73, -9.2],
	zoom: 8
});
var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>'

var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
	maxZoom: 18,
	attribution: attribution,
	id: 'mapbox.streets'
}).addTo(map);
var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
	maxZoom: 18,
	attribution: attribution,
	id: 'mapbox.satellite'
});
var baseMaps = {
	"Satellite": satellite,
	"Streets": streets
};
L.control.layers(baseMaps).addTo(map);
L.control.scale().addTo(map);


var popup = L.popup();
var nVerticesId = document.getElementById('nVertices');
var minDistId = document.getElementById('minDist');
var maxDistId = document.getElementById('maxDist');

function onMapClick(e) {
	nVertices = parseFloat(nVerticesId.value);
	minDist = parseFloat(minDistId.value);
	maxDist = parseFloat(maxDistId.value);
	if(nVertices && minDist && maxDist){
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.lat.toString() + ", " + e.latlng.lng.toString())
			.openOn(map);

		nVerticesId.style.backgroundColor = "";
		minDistId.style.backgroundColor = "";
		maxDistId.style.backgroundColor = "";

		L.marker(e.latlng).addTo(map);
		var a = 360/nVertices;
		var array = [];
		for (i=0; i< nVertices; i++) {
			var dist = getRandomArbitrary(minDist, maxDist);
			console.log(typeof(minDist))
			array.push(calculateCoordinates(dist,i*a, e.latlng.lat,e.latlng.lng));
		}
		L.polygon(array).addTo(map);
	} else {
		popup
			.setLatLng(e.latlng)
			.setContent("Fill in the menu")
			.openOn(map);
		if(!nVertices.value)
			nVertices.style.backgroundColor = "lightpink";
		if(!minDist.value)
			minDist.style.backgroundColor = "lightpink";
		if(!maxDist.value)
			maxDist.style.backgroundColor = "lightpink";
	}
}


function calculateCoordinates(distance, bearing, lat1, lon1) { //http://williams.best.vwh.net/avform.htm#LL
	var pi =  Math.PI;
	var toRad = (pi/180);
	var sLat1 = Math.sin(lat1*toRad), cLat1 = Math.cos(lat1*toRad);
	var sD = Math.sin(distance/6378), cD = Math.cos(distance/6378);
	var sTc = Math.sin(bearing*toRad), cTc = Math.cos(bearing*toRad);

	var lat2 = Math.asin(sLat1*cD + cLat1*sD*cTc);
	var sLat2 = Math.sin(lat2);
	var dLon = Math.atan2(sTc*sD*cLat1,cD-sLat1*sLat2);

	var lon2 = ((lon1*toRad-dLon + pi) % (2*pi)) - pi;

	var coords = [lat2*(180/pi), lon2*(180/pi)];
	return coords;
}//http://gis.stackexchange.com/questions/5821/calculating-latitude-longitude-x-miles-from-point

function getRandomArbitrary(min, max) {
	return  (Math.random()*(max-min+1)+min);
}

map.on('click', onMapClick);;
