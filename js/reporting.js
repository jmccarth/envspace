/**
 buildReportDialog()

 Gets list of unique departments and functions and populates the lists in the report dialog
 */
function buildReportDialog() {
	// Get list of departments
	allRoomsQuery = new esri.tasks.Query();

	allRoomsQuery.outFields = ["iapdata_Department_Name", "iapdata_Function_ID_and_Name"];
	allRoomsQuery.where = "OBJECTID >= 0";

	var byDeptTask = new esri.tasks.QueryTask(roomsLayerURL);
	byDeptTask.execute(allRoomsQuery, function(results) {
		var uniqueDepts = [];
		var uniqueFuncs = [];
		for (room in results.features) {
			if (dojo.indexOf(uniqueDepts, results.features[room].attributes["iapdata_Department_Name"]) == -1) {
				uniqueDepts.push(results.features[room].attributes["iapdata_Department_Name"]);
			}

			if (dojo.indexOf(uniqueFuncs, results.features[room].attributes["iapdata_Function_ID_and_Name"]) == -1) {
				uniqueFuncs.push(results.features[room].attributes["iapdata_Function_ID_and_Name"]);
			}
		}

		//var dList = dijit.byId("deptList");
		var dList = dojo.byId("deptList");
		for (dept in uniqueDepts) {
			deptName = uniqueDepts[dept];
			//var o = document.createElement("option");
			//o.label = deptName;
			//o.value = deptName;
			//dList.add(o,null);
			dojo.byId("deptList").options.add(new Option(deptName, deptName));
			/*dList.addOption({
			 label:deptName,
			 value:deptName
			 });*/
		}

		//var fList = dijit.byId("funcList");
		for (func in uniqueFuncs) {
			funcName = uniqueFuncs[func];
			dojo.byId("funcList").options.add(new Option(funcName, funcName));
			/*fList.addOption({
			 label:funcName,
			 value:funcName
			 });*/
		}
	});
}

/**
 generateReport()
 */
function generateReport() {
	var deptName;
	var funcName;
	var showASF = dojo.byId("asfCheck").checked;
	var deptChecked = dojo.byId("byDeptCheck").checked;
	var funcChecked = dojo.byId("byFuncCheck").checked;

	if (deptChecked || funcChecked) {
		var byDept = new esri.tasks.Query();
		var byDeptTask = new esri.tasks.QueryTask(roomsLayerURL);

		byDept.where = "";

		if (dojo.byId("byDeptCheck").checked) {
			deptName = dojo.byId("deptList").value;
			byDept.where += "iapdata_Department_Name = '" + deptName + "'";
		}
		if (dojo.byId("byFuncCheck").checked) {
			funcName = dojo.byId("funcList").value;
			if (byDept.where.length > 0) {
				byDept.where += " AND iapdata_Function_ID_and_Name = '" + funcName + "'";
			} else {
				byDept.where += "iapdata_Function_ID_and_Name = '" + funcName + "'";
			}
		}

		byDept.outFields = ["*"];
		byDeptTask.execute(byDept, function(featureSet) {
			var totalSpace = 0;
			for (room in featureSet.features) {
				totalSpace += featureSet.features[room].attributes.Assignable_Square_Feet
			}

			var items = dojo.map(featureSet.features, function(feature) {
				return feature.attributes;
			});
			var data = {
				identifier : "OBJECTID",
				items : items
			};
			store = new dojo.data.ItemFileReadStore({
				data : data
			});
			grid.setStore(store);
			grid.setSortIndex(1, "true");

			if (showASF) {
				alert("Total Assignable Square Feet is:" + totalSpace);
			}

		});
		hide('reportDialog');
	} else {
		alert("You must select at least one department or one function");
	}
}

function reportByFunctionResults(funcName) {
	var byFunc = new esri.tasks.Query();
	var byFuncTask = new esri.tasks.QueryTask(roomsLayerURL);

	byFunc.where = "iapdata_Function_ID_and_Name = '" + funcName + "'";
	byFunc.outFields = ["*"];
	byFuncTask.execute(byFunc, function(featureSet) {
		var totalSpace = 0;
		for (room in featureSet.features) {
			totalSpace += featureSet.features[room].attributes.Assignable_Square_Feet
		}

		var items = dojo.map(featureSet.features, function(feature) {
			return feature.attributes;
		});
		var data = {
			identifier : "OBJECTID",
			items : items
		};
		store = new dojo.data.ItemFileReadStore({
			data : data
		});
		grid.setStore(store);
		grid.setSortIndex(1, "true");

		alert("Total Assignable Square Feet for " + funcName + " is:" + totalSpace);
	});
}

function zoomTo(id) {
	var zBtn = "<a onClick=\"zoomRow('" + id + "')\">Show</a>";
	return zBtn;
}

function zoomRow(id) {
	roomsLayer.clearSelection();

	var query = new esri.tasks.Query();
	query.objectIds = [id];
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

function showSelectedRows(){
	var selRows = grid.selection.getSelected();
	var ids = []
	var sQuery = new esri.tasks.Query();
	var whereClause = "";
	for (r in selRows){
		whereClause += "SPACEID = '" + selRows[r].SPACEID[0] + "' OR "
	}
	whereClause = whereClause.substring(0,whereClause.length - 3); //trim last "OR"
	roomsLayer.setDefinitionExpression(whereClause);
	
	//symbolize by floor
}
