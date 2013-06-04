/**
 symbolizeByDepartment()

 Send a request off to the rooms layer to generate a unique values renderer based on the department name.
 Build a colour ramp and apply it to the rooms layer, then refresh.
 */
function symbolizeByDepartment() {
	dojo.byId("legendDiv").hidden = false;
	//make sure legend is visible
	var generateRenderer = new esri.tasks.GenerateRendererTask(roomsLayerURL);
	var params = new esri.tasks.GenerateRendererParameters();

	var classDef = new esri.tasks.UniqueValueDefinition();
	classDef.attributeField = "Department_Name";
	classDef.baseSymbol = new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([255, 0, 0, 0.5]));
	var cRamp = new esri.tasks.AlgorithmicColorRamp();
	cRamp.fromColor = dojo.colorFromHex("#0033ff");
	cRamp.toColor = dojo.colorFromHex("#ff3300");
	cRamp.algorithm = "hsv";
	classDef.colorRamp = cRamp;

	params.classificationDefinition = classDef;
	params.where = "1=1";

	generateRenderer.execute(params, function(renderer) {
		roomsLayer.setRenderer(renderer);
		roomsLayer.refresh();
		legend.refresh();
	}, function(err) {
		console.log(err);
	});
}

/**
 symbolizeByFunction()

 Send a request off to the rooms layer to generate a unique values renderer based on the function name.
 Build a colour ramp and apply it to the rooms layer, then refresh.
 */

function symbolizeByFunction() {
	dojo.byId("legendDiv").hidden = false;
	//make sure legend is visible
	var generateRenderer = new esri.tasks.GenerateRendererTask(roomsLayerURL);
	var params = new esri.tasks.GenerateRendererParameters();

	var classDef = new esri.tasks.UniqueValueDefinition();
	classDef.attributeField = "Function_ID_and_Name";
	classDef.baseSymbol = new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([255, 0, 0, 0.5]));
	var cRamp = new esri.tasks.AlgorithmicColorRamp();
	cRamp.fromColor = dojo.colorFromHex("#998ec3");
	cRamp.toColor = dojo.colorFromHex("#f1a340");
	cRamp.algorithm = "hsv";
	classDef.colorRamp = cRamp;

	params.classificationDefinition = classDef;
	params.where = "1=1";

	generateRenderer.execute(params, function(renderer) {
		roomsLayer.setRenderer(renderer);
		roomsLayer.refresh();
		legend.refresh();
	}, function(err) {
		console.log(err);
	});

}

/**
 symbolizeDefault()

 Create a basic single-symbol renderer to show the rooms.
 */
function symbolizeDefault() {
	var symbol = new esri.symbol.SimpleFillSymbol().setColor(new dojo.Color([0, 100, 100]));
	symbol.outline.setStyle(esri.symbol.SimpleLineSymbol.STYLE_NULL);
	var renderer = new esri.renderer.SimpleRenderer(symbol);
	roomsLayer.setRenderer(renderer);
	roomsLayer.refresh();
	legend.refresh();
	dojo.byId("legendDiv").hidden = true;
	//hide legend when there's only one symbol
}

function visualize(vizType) {
	if (vizType == "byDept") {
		symbolizeByDepartment();
	} else if (vizType == "byFunc") {
		symbolizeByFunction();
	} else if (vizType == "default") {
		symbolizeDefault();
	}
}