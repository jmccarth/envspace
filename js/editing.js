var updateFeature;
var activeInspector, editAttInspector, envAttInspector;

function startEdit(spaceid) {
	map.infoWindow.hide();

	var sQuery = new esri.tasks.Query();
	sQuery.where = "SPACEID='" + spaceid + "'";
	roomsUpdateLayer.selectFeatures(sQuery, esri.layers.FeatureLayer.SELECTION_NEW, function(results) {
		//if there are no results then there are no edits in the edits table
		//start a new record and select it
		if(results.length == 0){
			var attr = {"SPACEID":spaceid,"Department_Name":"","Function_ID_and_Name":"","Edited_By":"Web","Edit_Status":"New"};
			var g = new esri.Graphic(null,null,attr);
			roomsUpdateLayer.applyEdits([g],null,null,function(editResults){
				var oidQuery = new esri.tasks.Query();
				oidQuery.where = "OBJECTID=" + editResults[0].objectId;
				roomsUpdateLayer.selectFeatures(oidQuery,esri.layers.FeatureLayer.SELECTION_NEW)
			});
		}
		show('editDialog');
	}, function(err) {
		console.log(err);
	});
}

function populateRoomInfoDialog(spaceid){
	var sQuery = new esri.tasks.Query();
	sQuery.where = "SPACEID= '" + spaceid + "'";
	roomsLayer.selectFeatures(sQuery,esri.layers.FeatureLayer.SELECTION_NEW,function(results){
		show('roomInfoDialog')
	});
	roomsUpdateLayer.selectFeatures(sQuery,esri.layers.FeatureLayer.SELECTION_NEW, function(results){
		updateFeature = results[0];
	});
}

function createIAPAttInspector() {
	var layerInfo = [{
		'featureLayer' : roomsLayer,
		'showDeleteButton' : false,
		'fieldInfos' : [{
			'fieldName' : 'SPACEID',
			'label' : 'Space ID',
			'isEditable' : false
		}, {
			'fieldName' : 'Function_ID_and_Name',
			'label' : 'Function',
			'isEditable' : false
		}, {
			'fieldName' : 'Department_Name',
			'label' : 'Department',
			'isEditable' : false
		}]
	}];

	var attInspector = new esri.dijit.AttributeInspector({
		layerInfos : layerInfo
	}, "iapAttrInsp");
}

function createENVAttInspector() {
	var layerInfo = [{
		'featureLayer' : roomsUpdateLayer,
		'showDeleteButton' : false,
		'isEditable' : false,
		'fieldInfos' : [{
			'fieldName' : 'SPACEID',
			'label' : 'Space ID',
			'isEditable' : false
		}, {
			'fieldName' : 'Function_ID_and_Name',
			'label' : 'Function',
			'isEditable' : true
		}, {
			'fieldName' : 'Department_Name',
			'label' : 'Department',
			'isEditable' : true
		}, {
			'fieldName' : 'Edit_Status',
			'label' : 'Edit Status',
			'isEditable' : false
		}
		]
	}];

	//get rid of old inspector and create and place a div to hold the new one
	if (typeof editAttInspector != "undefined"){
		editAttInspector.destroy();
	}
	var eDiv = document.createElement("div");
	eDiv.id = "envAttrInsp";
	document.getElementById("envView").appendChild(eDiv);

	envAttInspector = new esri.dijit.AttributeInspector({
		layerInfos : layerInfo
	}, "envAttrInsp");
	
	var q = new esri.tasks.Query();
	q.objectIds = [roomsUpdateLayer.getSelectedFeatures()[0].attributes.OBJECTID];
	roomsUpdateLayer.selectFeatures(q);
	
	activeInspector = envAttInspector;
}

function createEditAttInspector() {
	var layerInfo = [{
		'featureLayer' : roomsUpdateLayer,
		'showDeleteButton' : false,
		'fieldInfos' : [{
			'fieldName' : 'SPACEID',
			'label' : 'Space ID',
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

	//get rid of old inspector and create and place a div to hold the new one
	if (typeof envAttInspector != "undefined"){
		envAttInspector.destroy();
	}
	var eDiv = document.createElement("div");
	eDiv.id = "envAttrInsp";
	document.getElementById("envView").appendChild(eDiv);

	editAttInspector = new esri.dijit.AttributeInspector({
		layerInfos : layerInfo
	}, "envAttrInsp");
	
	var q = new esri.tasks.Query();
	if (roomsUpdateLayer.getSelectedFeatures().length > 0){
		q.objectIds = [roomsUpdateLayer.getSelectedFeatures()[0].attributes.OBJECTID];
		roomsUpdateLayer.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW, function(results){
			updateFeature = results[0];
		});
	}
	else{
		// There are no existing edits to this space, so create a new record (as a graphic) and set updateFeature to hold it
		var g = new esri.Graphic(null,null,{SPACEID: roomsLayer.getSelectedFeatures()[0].attributes.SPACEID, Edit_Status: "New", Edited_By: "Web"});
		roomsUpdateLayer.applyEdits([g],null,null,function(editResult){
			resultOID = editResult[0].objectId;
			var oidQuery = new esri.tasks.Query();
			oidQuery.where = "OBJECTID=" + resultOID;
			roomsUpdateLayer.selectFeatures(oidQuery,esri.layers.FeatureLayer.SELECTION_NEW,function(results){
				updateFeature = results[0];
			});
		});
		
	}
	
	activeInspector = editAttInspector;

	dojo.connect(editAttInspector, "onAttributeChange", function(feature, fieldName, newFieldValue) {
		updateFeature.attributes[fieldName] = newFieldValue;
		//updateFeature.attributes["Last_Edit_Date"] = Date();
	});

}

function switchAttInspector(){
	
	//if not editing
	if (dijit.byId("editRecord").get("label") == "Edit"){
		createEditAttInspector();
		//change label on button
		dijit.byId("editRecord").set("label","Stop Editing");
		dojo.byId("saveEdits").hidden = false;
	}
	//if editing
	else{
		createENVAttInspector();
		//change label on button
		dijit.byId("editRecord").set("label","Edit");
		dojo.byId("saveEdits").hidden = true;
	}
}

function applyEdits(){
	updateFeature.getLayer().applyEdits(null,[updateFeature],null)
	dijit.byId("envAttrInsp").refresh();
}
