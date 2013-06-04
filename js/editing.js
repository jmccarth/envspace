function startEdit(spaceid) {
	map.infoWindow.hide();

	var sQuery = new esri.tasks.Query();
	sQuery.where = "SPACEID='" + spaceid + "'";
	roomsUpdateLayer.selectFeatures(sQuery, esri.layers.FeatureLayer.SELECTION_NEW, function(results) {
		dijit.byId('editDialog').show();
	}, function(err) {
		console.log(err);
	});
}

function createAttInspector() {
	var layerInfo = [{
		'featureLayer' : roomsUpdateLayer,
		'showDeleteButton' : false,
		'fieldInfos' : [{
			'fieldName' : 'LONGNAME',
			'label' : 'Room Name',
			'isEditable' : false
		}, {
			'fieldName' : 'Function_ID_and_Name',
			'label' : 'Function',
			'isEditable' : true
		}, {
			'fieldName' : 'Department_Name',
			'label' : 'Department',
			'isEditable' : true
		}]
	}];

	var attInspector = new esri.dijit.AttributeInspector({
		layerInfos : layerInfo
	}, "attrInsp");

	dojo.connect(attInspector, "onAttributeChange", function(feature, fieldName, newFieldValue) {
		feature.attributes[fieldName] = newFieldValue;
		feature.getLayer().applyEdits(null, [feature], null);
	});
}