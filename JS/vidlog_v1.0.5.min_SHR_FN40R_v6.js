function finishLoading(){var a=document.getElementById('loader');var b=document.getElementById('loading');var c=document.getElementById('floating-panel');var d=document.getElementById('map');var e=document.getElementById('pano');var f=document.getElementById('divider');if(a)a.style.display='none';if(b)b.style.display='none';if(c)c.style.display='block';if(d)d.style.display='block';if(e)e.style.display='block';if(f)f.style.display='block';}
var s_rdwyid = document.getElementById('rdwyid');
var s_mp = document.getElementById('milepoint');
var map, MPmarker, curpos, sym, sv, panorama, curheading, curpitch;
var bmp, emp, shp_mp_ratio;
var cntylines, allRoads, selectedRoad, selectedLine;
var isctrloc = 0;
var currentFN40RFilter = 'ALL';
var currentDistrictFilter = 'ALL';
var currentCountyFilter = 'ALL';
var selectedFeature = null;
var count = 0;
var uid;
var url = window.location.href;
var urlArray = url.split("/");
urlArray.pop();
var page = window.location.pathname.split("/");
var site = page.pop();
page = urlArray.join('/') + '/' + site;
var sectionInfo = url.split("#");
var paraInfo;
var id_i, mp_i;
if (sectionInfo.length == 2) {
	paraInfo = sectionInfo[1].split("&");
	paraInfo.forEach(function (p) {
		if (p.split("=")[0] == "id") {
			id_i = p.split("=")[1];
		} else if (p.split("=")[0] == "mp") {
			mp_i = p.split("=")[1];
		}
	});
}
if (typeof id_i != 'undefined') {
	s_rdwyid.value = id_i;
}
if (typeof mp_i != 'undefined') {
	s_mp.value = mp_i;
}
function isOdd(num) {
	return num % 2;
}
function initialize() {
	window.setTimeout(function(){finishLoading();},10000);
	sym = {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		scale: 4,
		strokeColor: '#0F0',
		fillColor: '#0F0',
		fillOpacity: .5,
		strokeOpacity: .65,
		zIndex: 15
	};
	var tpH = $('#pano');
	var divH = $('#divider');
	var mapH = $('#map');
	var h = $('body').height();
	mapH.css('height', h - tpH.outerHeight() - divH.outerHeight());
	map = new google.maps.Map(document.getElementById('map'), {
			center: curpos,
			zoom: 12,
			streetViewControl: false,
			fullscreenControl: false,
			styles: [{
					elementType: 'geometry',
					stylers: [{
							color: '#242f3e'
						}
					]
				}, {
					elementType: 'labels.text.stroke',
					stylers: [{
							color: '#242f3e'
						}
					]
				}, {
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#746855'
						}
					]
				}, {
					featureType: 'administrative.locality',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#d59563'
						}
					]
				}, {
					featureType: 'poi',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#d59563'
						}
					]
				}, {
					featureType: 'poi.park',
					elementType: 'geometry',
					stylers: [{
							color: '#263c3f'
						}
					]
				}, {
					featureType: 'poi.park',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#6b9a76'
						}
					]
				}, {
					featureType: 'road',
					elementType: 'geometry',
					stylers: [{
							color: '#38414e'
						}
					]
				}, {
					featureType: 'road',
					elementType: 'geometry.stroke',
					stylers: [{
							color: '#212a37'
						}
					]
				}, {
					featureType: 'road',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#9ca5b3'
						}
					]
				}, {
					featureType: 'road.highway',
					elementType: 'geometry',
					stylers: [{
							color: '#746855'
						}
					]
				}, {
					featureType: 'road.highway',
					elementType: 'geometry.stroke',
					stylers: [{
							color: '#1f2835'
						}
					]
				}, {
					featureType: 'road.highway',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#f3d19c'
						}
					]
				}, {
					featureType: 'transit',
					elementType: 'geometry',
					stylers: [{
							color: '#2f3948'
						}
					]
				}, {
					featureType: 'transit.station',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#d59563'
						}
					]
				}, {
					featureType: 'water',
					elementType: 'geometry',
					stylers: [{
							color: '#17263c'
						}
					]
				}, {
					featureType: 'water',
					elementType: 'labels.text.fill',
					stylers: [{
							color: '#515c6d'
						}
					]
				}, {
					featureType: 'water',
					elementType: 'labels.text.stroke',
					stylers: [{
							color: '#17263c'
						}
					]
				}
			]
		});
	map.addListener('dblclick', function () {
		if (!isLandscape) {
			count = count + 1;
			if (isOdd(count)) {
				t.css('height', 0);
				t.css('width', w);
				t.css('float', 'left');
				b.css('height', 0.99 * h);
				b.css('width', w);
				d.css('height', h - t.height() - b.height());
				d.css('width', w);
				d.css('cursor', 'n-resize');
			} else {
				t.css('height', 0.70 * h);
				t.css('width', w);
				t.css('float', 'left');
				b.css('height', 0.29 * h);
				b.css('width', w);
				d.css('height', h - t.height() - b.height());
				d.css('width', w);
				d.css('cursor', 'n-resize');
			}
			google.maps.event.trigger(map, "resize");
			google.maps.event.trigger(panorama, "resize");
			curpos = panorama.getPosition();
			var zoomLevel = map.getZoom();
			map.setZoom(zoomLevel - 1);
			map.panTo(curpos);
		}
	});
	MPmarker = new google.maps.Marker({
			position: curpos,
			map: map,
			icon: sym,
			visible: false,
			label: {
				text: " ",
				color: "#FFF",
				fontWeight: "bold"
			}
		});
	MPmarker.addListener('click', function () {
		var nav = "https://www.google.com/maps/dir//"
			var navToLat = MPmarker.position.lat();
		var navToLng = MPmarker.position.lng();
		var navTo = nav.concat(navToLat, ",", navToLng);
		var url = '<strong>RoadID:</strong> ' + s_rdwyid.value + '<br><strong>MP:</strong> ' + s_mp.value + '<br><strong>GPS:</strong> ' + MPmarker.position.lat().toFixed(6) + ', ' + MPmarker.position.lng().toFixed(6) + '<br>' + '<a href=' + navTo + ' target="_blank">Navigate to this MP</a> ';
		infowindow.setContent(url);
		infowindow.open(map, MPmarker);
	});
	MPmarker.addListener('position_changed', function () {
		infowindow.close();
	});
	var infowindow = new google.maps.InfoWindow();
	panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), {
			linksControl: true,
			panControl: true,
			enableCloseButton: false,
			addressControl: false,
			imageDateControl: true,
			showRoadLabels: false
		});
	panorama.addListener('pano_changed', function () {
		curpos = panorama.getPosition();
		if(curpos && isFinite(curpos.lat()) && isFinite(curpos.lng())) refreshMap(curpos);
	});
	panorama.addListener('position_changed', function () {
		curpos = panorama.getPosition();
		if(curpos && isFinite(curpos.lat()) && isFinite(curpos.lng())) refreshMap(curpos);
	});
	panorama.addListener('pov_changed', function () {
		curheading = panorama.getPov().heading;
		curpitch = panorama.getPov().pitch;
		sym = {
			path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			rotation: curheading,
			scale: 4,
			strokeColor: '#0F0',
			fillColor: '#0F0',
			fillOpacity: .5,
			strokeOpacity: .65,
			zIndex: 15
		};
		MPmarker.setIcon(sym);
	});
	sv = new google.maps.StreetViewService();
	if (s_rdwyid.value == "" & s_mp.value == "") {
		curpos = new google.maps.LatLng({
				lat: 29.673784,
				lng: -82.266523
			});
		curheading = 175;
		curpitch = 1;
		sv.getPanorama({
			location: curpos,
			radius: 50
		}, processSVData);
	}
	// Florida county layer removed for performance.

	selectedRoad = new google.maps.Data();
	allRoads = map.data;
	allRoads.addGeoJson(roads);
	finishLoading();
	/*
	 * One FN40R color system for every SHR segment.
	 * Green  = FN40R >= 35
	 * Yellow = 30 <= FN40R < 35
	 * Red    = FN40R < 30
	 * Gray   = missing/invalid FN40R (All Roads only)
	 */
	function cleanFilterValue(value) {
		return value === undefined || value === null ? '' : String(value).trim();
	}

	function getDistrictValue(feature) {
		return cleanFilterValue(feature.getProperty('DistrictID') || feature.getProperty('District'));
	}

	function getCountyValue(feature) {
		return cleanFilterValue(feature.getProperty('CountyName') || feature.getProperty('County'));
	}

	function sortFilterValues(values) {
		return values.sort(function (a, b) {
			return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
		});
	}

	function replaceFilterOptions(selectElement, allLabel, values, selectedValue) {
		selectElement.innerHTML = '';
		var allOption = document.createElement('option');
		allOption.value = 'ALL';
		allOption.textContent = allLabel;
		selectElement.appendChild(allOption);
		values.forEach(function (value) {
			var option = document.createElement('option');
			option.value = value;
			option.textContent = value;
			selectElement.appendChild(option);
		});
		selectElement.value = values.indexOf(selectedValue) >= 0 ? selectedValue : 'ALL';
	}

	function updateDistrictCountyOptions(changedFilter) {
		var districtSelect = document.getElementById('districtFilter');
		var countySelect = document.getElementById('countyFilter');
		if (!districtSelect || !countySelect) return;

		var districts = {};
		var counties = {};
		allRoads.forEach(function (feature) {
			var district = getDistrictValue(feature);
			var county = getCountyValue(feature);
			if (changedFilter !== 'COUNTY' || currentCountyFilter === 'ALL' || county === currentCountyFilter) {
				if (district) districts[district] = true;
			}
			if (changedFilter !== 'DISTRICT' || currentDistrictFilter === 'ALL' || district === currentDistrictFilter) {
				if (county) counties[county] = true;
			}
		});

		var districtValues = sortFilterValues(Object.keys(districts));
		var countyValues = sortFilterValues(Object.keys(counties));
		replaceFilterOptions(districtSelect, 'All Districts', districtValues, currentDistrictFilter);
		replaceFilterOptions(countySelect, 'All Counties', countyValues, currentCountyFilter);
		currentDistrictFilter = districtSelect.value;
		currentCountyFilter = countySelect.value;
	}

	function applyRoadFilters() {
		selectedFeature = null;
		allRoads.revertStyle();
		allRoads.setStyle(getFN40RRoadStyle);
		selectedRoad.forEach(function (feature) { selectedRoad.remove(feature); });
	}

	function getFN40RRoadStyle(feature) {
		var fn40r = parseFloat(feature.getProperty('FN40R'));
		var category = 'NO_DATA';
		var color = '#808080';

		if (!isNaN(fn40r)) {
			if (fn40r >= 35) {
				category = 'GREEN';
				color = '#00C853';
			} else if (fn40r >= 30) {
				category = 'YELLOW';
				color = '#FFD600';
			} else {
				category = 'RED';
				color = '#D50000';
			}
		}

		var district = getDistrictValue(feature);
		var county = getCountyValue(feature);
		var fnMatch = currentFN40RFilter === 'ALL' || currentFN40RFilter === category;
		var districtMatch = currentDistrictFilter === 'ALL' || district === currentDistrictFilter;
		var countyMatch = currentCountyFilter === 'ALL' || county === currentCountyFilter;
		var visible = fnMatch && districtMatch && countyMatch;

		return {
			strokeColor: color,
			strokeWeight: visible ? 5 : 0,
			strokeOpacity: visible ? 0.85 : 0,
			zIndex: 5,
			clickable: visible
		};
	}

	allRoads.setStyle(getFN40RRoadStyle);

	var fn40rFilter = document.getElementById('fn40rFilter');
	var districtFilter = document.getElementById('districtFilter');
	var countyFilter = document.getElementById('countyFilter');

	updateDistrictCountyOptions('INITIAL');

	if (fn40rFilter) {
		fn40rFilter.value = currentFN40RFilter;
		fn40rFilter.addEventListener('change', function () {
			currentFN40RFilter = this.value;
			applyRoadFilters();
		});
	}

	if (districtFilter) {
		districtFilter.addEventListener('change', function () {
			currentDistrictFilter = this.value;
			updateDistrictCountyOptions('DISTRICT');
			applyRoadFilters();
		});
	}

	if (countyFilter) {
		countyFilter.addEventListener('change', function () {
			currentCountyFilter = this.value;
			updateDistrictCountyOptions('COUNTY');
			applyRoadFilters();
		});
	}
	/*
	 * Build a Turf LineString from a Google Maps Data feature.
	 * Uses only the documented Maps Data API.
	 */
	function buildSelectedLine(feature) {
		var coordinates = [];
		var geometry = feature.getGeometry();

		if (!geometry) {
			return null;
		}

		geometry.forEachLatLng(function (latLng) {
			coordinates.push([latLng.lng(), latLng.lat()]);
		});

		if (coordinates.length < 2) {
			return null;
		}

		return {
			"type": "Feature",
			"properties": {
				"ROADWAY": feature.getProperty("RoadwayId"),
				"BEGIN_POST": parseFloat(feature.getProperty("BegMP")),
				"END_POST": parseFloat(feature.getProperty("EndMP")),
				"FN40R": parseFloat(feature.getProperty("FN40R"))
			},
			"geometry": {
				"type": "LineString",
				"coordinates": coordinates
			}
		};
	}

	/*
	 * Shared handler used by both the original pink layer and the
	 * green/red selected-road layer.
	 */
	function processRoadClick(e, sourceLayer) {
		if (!e || !e.feature || !e.latLng) {
			return;
		}

		infowindow.close();
		MPmarker.setVisible(false);

		var roadway = e.feature.getProperty("RoadwayId");
		if (roadway === undefined || roadway === null || roadway === "") {
			console.error("Clicked feature has no ROADWAY property.");
			return;
		}

		// Always populate the RWYID input, regardless of line color/layer.
		s_rdwyid.value = String(roadway);

		selectedLine = buildSelectedLine(e.feature);
		if (!selectedLine) {
			console.error("Unable to build roadway geometry for " + roadway);
			return;
		}

		var pt = {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": [e.latLng.lng(), e.latLng.lat()]
			}
		};

		var ptOnLine;
		try {
			ptOnLine = turf.pointOnLine(selectedLine, pt, "miles");
		} catch (error) {
			console.error("Unable to locate the clicked point on " + roadway, error);
			return;
		}

		// Restore the previous selection to its FN40R/filter style.
		if (selectedFeature) {
			allRoads.revertStyle(selectedFeature);
		}
		selectedFeature = e.feature;
		allRoads.overrideStyle(selectedFeature, {
			strokeColor: '#0066FF',
			strokeWeight: 8,
			strokeOpacity: 1,
			zIndex: 20,
			clickable: true
		});

		var newpt = new google.maps.LatLng({
			lat: ptOnLine.geometry.coordinates[1],
			lng: ptOnLine.geometry.coordinates[0]
		});

		sv.getPanorama({
			location: newpt,
			radius: 50
		}, processSVData);
	}

	allRoads.addListener('click', function (e) {
		processRoadClick(e, allRoads);
	});

	selectedRoad.addListener('click', function (e) {
		processRoadClick(e, selectedRoad);
	});
	if (s_rdwyid.value != "") {
		loadInitial(0);
	}
};
function processSVData(data, status) {
	finishLoading();
	if (status !== google.maps.StreetViewStatus.OK || !data || !data.location) {
		console.error('Street View data not found or invalid.', status);
		return;
	}
	var panoId = data.location.pano || data.location.panoId || data.location.id;
	if (typeof panoId === 'string' && panoId.length > 0) {
		panorama.setPano(panoId);
	} else if (data.location.latLng) {
		panorama.setPosition(data.location.latLng);
	} else {
		console.error('Invalid Street View response', data.location);
		return;
	}
	panorama.setPov({heading: Number(curheading)||0,pitch: Number(curpitch)||0});
	panorama.setVisible(true);
};
function refreshMap(pos) {
	while (typeof map === 'undefined') {
		refreshMap(pos);
	}
	map.panTo(pos);
	MPmarker.setVisible(true);
	MPmarker.setMap(map);
	MPmarker.setPosition(pos);
	if (typeof selectedLine != 'undefined') {
		var pt = {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": [pos.lng(), pos.lat()]
			}
		}
		var start = {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": selectedLine.geometry.coordinates[0]
			}
		};
		var shpLenth = turf.lineDistance(selectedLine, 'miles');
		var sliced = turf.lineSlice(start, pt, selectedLine);
		var leng = turf.lineDistance(sliced, 'miles');
		shp_mp_ratio = shpLenth / (selectedLine.properties.END_POST - selectedLine.properties.BEGIN_POST);
		var newmp = selectedLine.properties.BEGIN_POST + leng / shp_mp_ratio;
		newmp = newmp.toFixed(3);
		s_mp.value = newmp;
		var label = MPmarker.getLabel();
		label.text = s_mp.value;
		MPmarker.setLabel(label);
		refreshURL();
	}
}
window.onpopstate = function (e) {
	s_rdwyid.value = "";
	s_mp.value = "";
	initialize();
	refreshURL();
};
function refreshURL() {
	if (s_rdwyid.value == "" & s_mp.value == "") {
		uid = "";
	} else {
		uid = "#id=" + s_rdwyid.value + "&mp=" + s_mp.value;
	}
	var stateObj = {
		foo: uid
	};
	var newURL = site + uid;
	window.history.pushState(stateObj, "SMO Navi", newURL);
};
var d = $('#divider');
var t = $('#pano');
var b = $('#map');
var h = $('body').height();
var w = $('body').width();
var isDragging = false;
var isLandscape = false;
d.mousedown(function (e) {
	isDragging = true;
	e.preventDefault();
});
$(document).mouseup(function () {
	isDragging = false;
}).mousemove(function (e) {
	if (isDragging) {
		if (!isLandscape) {
			t.css('height', e.pageY);
			b.css('height', h - e.pageY - d.height());
		} else {
			t.css('width', e.pageX);
			b.css('width', w - e.pageX - d.width() - 0.014 * w);
		}
		google.maps.event.trigger(map, "resize");
		google.maps.event.trigger(panorama, "resize");
		curpos = panorama.getPosition();
		map.panTo(curpos);
		MPmarker.setPosition(curpos);
	}
});
var rotateBtn = document.getElementById('rotateScreen');
if (rotateBtn) {
	rotateBtn.addEventListener('click', rotateDisplay, false);
} else {
	throw error;
}
function rotateDisplay() {
	if (!isLandscape) {
		isLandscape = true;
		t.css('height', h);
		t.css('width', Math.round(0.70 * w));
		b.css('height', h);
		b.css('width', Math.round(0.29 * w) - 0.01 * w);
		d.css('height', h);
		d.css('width', (w - t.width() - b.width()) / 3);
		d.css('cursor', 'w-resize');
	} else {
		isLandscape = false;
		t.css('height', Math.round(0.70 * h));
		t.css('width', w);
		t.css('float', 'left');
		b.css('height', Math.round(0.29 * h));
		b.css('width', w);
		b.css('float', 'left');
		d.css('height', h - t.height() - b.height());
		d.css('width', w);
		d.css('cursor', 'n-resize');
		d.css('float', 'left');
	}
	google.maps.event.trigger(map, "resize");
	google.maps.event.trigger(panorama, "resize");
	curpos = panorama.getPosition();
	map.panTo(curpos);
	MPmarker.setPosition(curpos);
}
var goBtn = document.getElementById('goToMP');
if (goBtn) {
	goBtn.addEventListener('click', function () {
		loadInitial(0);
	}, false);
} else {
	throw error;
}
var goBMPBtn = document.getElementById('goBMP');
if (goBMPBtn) {
	goBMPBtn.addEventListener('click', function () {
		loadInitial(1);
	}, false);
} else {
	throw error;
}
var goEMPBtn = document.getElementById('goEMP');
if (goEMPBtn) {
	goEMPBtn.addEventListener('click', function () {
		loadInitial(2);
	}, false);
} else {
	throw error;
}
function loadInitial(MPtype) {
	var validRdwyID = false;
	var BMPs = [];
	var EMPs = [];
	if (s_rdwyid.value === "") {
		alert("Please enter Road ID");
		return;
	} else {
		allRoads.revertStyle();
		selectedRoad.forEach(function (ff) {
			selectedRoad.remove(ff);
		});
		allRoads.forEach(function (feature) {
			if (feature.getProperty("RoadwayId") == s_rdwyid.value) {
				validRdwyID = true;
				allRoads.overrideStyle(feature, {
					strokeWeight: 0
				});
				selectedRoad.add(feature);
				BMPs.push(parseFloat(feature.getProperty("BegMP")));
				EMPs.push(parseFloat(feature.getProperty("EndMP")));
			}
		});
		selectedRoad.setMap(map);
		selectedRoad.setStyle({
			strokeColor: '#0066FF',
			strokeWeight: 8,
			strokeOpacity: 1,
			zIndex: 20,
			clickable: true
		});
		var minBMP;
		var maxEMP;
		var curBMP;
		var curEMP;
		if (validRdwyID) {
			if (s_mp.value === "") {
				minBMP = BMPs.reduce(function (a, b) {
						return Math.min(a, b);
					});
				maxEMP = EMPs.reduce(function (a, b) {
						return Math.max(a, b);
					});
			} else {
				for (i = 0; i < BMPs.length; i++) {
					if (BMPs[i] <= parseFloat(s_mp.value) && EMPs[i] >= parseFloat(s_mp.value)) {
						curBMP = BMPs[i];
						curEMP = EMPs[i];
					}
				}
			}
			if (MPtype == 0) {
				if (s_mp.value === "") {
					s_mp.value = minBMP;
				}
				if (typeof curBMP == 'undefined') {
					curBMP = minBMP;
				}
				curEMP = EMPs[BMPs.indexOf(curBMP)];
			} else if (MPtype == 1) {
				if (typeof curBMP == 'undefined') {
					curBMP = minBMP;
				}
				s_mp.value = curBMP;
				curEMP = EMPs[BMPs.indexOf(curBMP)];
			} else {
				if (typeof curEMP == 'undefined') {
					curEMP = maxEMP;
				}
				s_mp.value = curEMP;
				curBMP = BMPs[EMPs.indexOf(curEMP)];
			}
			if (typeof curBMP == 'undefined') {
				alert("Please enter a valid milepoint");
				return;
			} else {
				selectedRoad.forEach(function (ff) {
					if (parseFloat(ff.getProperty("BegMP")) == curBMP) {
						selectedLine = {
							"type": "Feature",
							"properties": {},
							"geometry": {
								"type": "LineString",
								"coordinates": []
							}
						};
						selectedLine.properties = {
							ROADWAY: ff.getProperty("RoadwayId"),
							BEGIN_POST: parseFloat(ff.getProperty("BegMP")),
							END_POST: parseFloat(ff.getProperty("EndMP")),
							FN40R: parseFloat(ff.getProperty("FN40R"))
						};
						ff.getGeometry().forEachLatLng(function (latLng) {
							selectedLine.geometry.coordinates.push([latLng.lng(), latLng.lat()]);
						});
					}
				});
			}
		} else {
			alert("Unable to find this Road ID");
			return;
		}
		bmp = selectedLine.properties.BEGIN_POST;
		emp = selectedLine.properties.END_POST;
		var mplen = emp - bmp;
		var shplen = turf.lineDistance(selectedLine, 'miles');
		shp_mp_ratio = shplen / mplen;
		var mp = parseFloat(s_mp.value);
		if (mp <= emp && mp >= bmp) {
			var mptshplen = (mp - bmp) * shp_mp_ratio;
			var mp_pt = turf.along(selectedLine, mptshplen, 'miles');
			curpos = new google.maps.LatLng({
					lat: mp_pt.geometry.coordinates[1],
					lng: mp_pt.geometry.coordinates[0]
				});
			sv.getPanorama({
				location: curpos,
				radius: 50
			}, processSVData);
		} else {
			alert("Please enter a valid milepoint");
			return;
		}
	}
};
