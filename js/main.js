function init() {
	esri.config.defaults.io.proxyUrl = "http://env-gisdev1.uwaterloo.ca/proxy.ashx";

	basemap = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer", {
		displayLevels : [15, 16, 17, 18, 19]
	});

	if (basemap.loaded) {
		addLods(basemap);
	} else {
		dojo.connect(basemap, "onLoad", addLods);
	}

	

	//create popup infotemplate
	//var template = new esri.InfoTemplate();
	//template.setTitle("Attributes of ${LONGNAME}");
	//template.setContent("Department ID: ${Department_ID}<br />" + "Department Name: ${Department_Name}<br />" + "Area (Assignable Sq. Ft.): ${Assignable_Square_Feet}<br />" + "Usage (IAP): ${Function_ID_and_Name}<br />" + "<button onclick='startEdit(\"${SPACEID}\")'>Edit</button>" + "<button onclick='showAssignment(\"${OBJECTID}\")'>Show Assignment</button>");
	//template.setContent("<ul id='popupTabBar' data-dojo-type='dojox/mobile/TabBar' data-dojo-props='barType:\"standardTab\"'><li data-dojo-type='dojox/mobile/TabBarButton' data-dojo-props='selected:true'>New</li><li data-dojo-type='dojox/mobile/TabBarButton'>What's Hot</li><li data-dojo-type='dojox/mobile/TabBarButton'>Genius</li></ul>");
	
	roomsLayer = new esri.layers.FeatureLayer(roomsLayerURL, {
		//infoTemplate : template,
		outFields : ["*"],
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		id : "Rooms"
	});

	//define a selection symbol
	var highlightSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
	roomsLayer.setSelectionSymbol(highlightSymbol);

	dojo.connect(roomsLayer, "onClick", function(evt) {
		//map.infoWindow.setFeatures([evt.graphic]);
		//map.infoWindow.show(evt.mapPoint);
		populateRoomInfoDialog(evt.graphic.attributes.SPACEID);
		populateResearcherView(evt.graphic.attributes.SPACEID);
		populateOccupantView(evt.graphic.attributes.SPACEID);
	});

	roomsUpdateLayer = new esri.layers.FeatureLayer(roomsUpdateLayerURL, {
		outFields : ["*"],
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		visible : false
	});

}

function initMap() {
	var initialExtent = new esri.geometry.Extent({
		"xmin" : -8966082.128405,
		"ymin" : 5383419.130605,
		"xmax" : -8965889.190495,
		"ymax" : 5383576.988895,
		"spatialReference" : {
			"wkid" : 102113
		}
	});
	//var popup = new esri.dijit.Popup(null, dojo.create("div"));
	//var popup = new esri.dijit.PopupMobile(null,dojo.create("div"));
	map = new esri.Map("map", {
		extent : initialExtent,
		//infoWindow : popup,
		lods : customLods,
		minZoom : 17,
		maxZoom : 20
	});
	
	
    

	dojo.connect(map, 'onLoad', function(map) {
		//resize the map when the browser resizes
		dojo.connect(dijit.byId('map'), 'resize', map, map.resize);

	});

	map.addLayer(basemap);
	map.addLayer(roomsUpdateLayer);
	map.addLayer(roomsLayer);

	legend = new esri.dijit.Legend({
		map : map,
		layerInfos : [{
			layer : roomsLayer,
			title : 'Rooms'
		}]
	}, "legendDiv");
	legend.startup();

	if (roomsLayer.loaded){
		createIAPAttInspector();
	} else{
		dojo.connect(roomsLayer,"onLoad",function(){
			createIAPAttInspector();	
		});
	}

	if (roomsUpdateLayer.loaded) {
		createENVAttInspector();
		//createEditAttInspector();
	} else {
		dojo.connect(roomsUpdateLayer, "onLoad", function() {
			createENVAttInspector();
			//createEditAttInspector();
		});
	}

	changeFloor(1);

	buildReportDialog();
	symbolizeDefault();
}

//Fill array with levels of detail
function addLods(lyr) {
	customLods = customLods.concat(lyr.tileInfo.lods);
	loadCount++;

	if (loadCount === 1) {
		initMap();
	}
}

/**
 changeFloor()

 When called, change the visible floor by using a definition expression to filter out all rooms not on that floor

 BUG:Need to find a way to signal the caller that this function is done
 */
function changeFloor(floorNum) {
	roomsLayer.setDefinitionExpression("FLOORKEY LIKE '%F" + floorNum + "'");
	dojo.byId("floorButton").selectedIndex = floorNum - 1;
	map.infoWindow.hide();
}