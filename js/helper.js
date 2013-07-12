function findRoom(roomNum) {
	var query = new esri.tasks.Query();
	query.where = "LONGNAME = '" + roomNum + "'";

	query.outFields = ["*"];
	var floorQueryTask = new esri.tasks.QueryTask(roomsLayerURL);
	floorQueryTask.execute(query, function(results) {
		floorkey = results.features[0].attributes["FLOORKEY"];
		changeFloor(floorkey.substr(floorkey.length - 1, 1));
		roomsLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function(features) {
			//zoom to the selected feature
			var roomExtent = features[0].geometry.getExtent().expand(5.0);
			map.setExtent(roomExtent);
		});
	});
}

function findRoomBySpaceID(spaceid) {
	var query = new esri.tasks.Query();
	query.where = "SPACEID = '" + spaceid + "'";

	query.outFields = ["*"];
	var floorQueryTask = new esri.tasks.QueryTask(roomsLayerURL);
	floorQueryTask.execute(query, function(results) {
		floorkey = results.features[0].attributes["FLOORKEY"];
		changeFloor(floorkey.substr(floorkey.length - 1, 1));
		roomsLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function(features) {
			//zoom to the selected feature
			var roomExtent = features[0].geometry.getExtent().expand(5.0);
			map.setExtent(roomExtent);
		});
	});
}

function clearSelection() {
	roomsLayer.clearSelection();
	map.infoWindow.hide();
}