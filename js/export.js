function exportCSV() {
	if (store == undefined) {
		alert("run a report first!");
	} else {
		var csvoutput = "";
		store.fetch({
			onComplete : function(items) {
				//Open and populate an html document (pop-up)

				csvoutput += "Room,Department,Function,Assignable Square Feet\n";
				//iterate over items to build the table content
				dojo.forEach(items, function(item, index) {
					csvoutput += item.iapdata_LONGNAME + "," + item.iapdata_Department_Name + "," + item.iapdata_Function_ID_and_Name + "," + item.iapdata_Assignable_Square_Feet + "\n";
				});

			}
		});
		location.href = 'data:application/download,' + encodeURIComponent(csvoutput);
	}
}

/**
 * printReport()
 *
 * Creates and prints a copy of the table in the report datagrid
 * User must allow popups for this to work
 */
function printReport() {
	if (store == undefined) {
		alert("run a report first!");
	} else {
		var win = window.open();
		self.focus();

		store.fetch({
			onComplete : function(items) {
				//Open and populate an html document (pop-up)
				win.document.open();
				win.document.write('<' + 'html' + '><' + 'head' + '><' + 'style' + '>');
				win.document.write('body, td { font-family: Verdana; font-size: 9pt;}');
				win.document.write('<' + '/' + 'style' + '><' + '/' + 'head' + '><' + 'body' + '>');
				win.document.write("<table style='width:100%'><th>Room</th><th>Department</th><th>Function</th><th>Assignable Square Feet</th>");

				//iterate over items to build the table content
				dojo.forEach(items, function(item, index) {
					win.document.write("<tr><td>" + item.iapdata_LONGNAME + "</td><td>" + item.iapdata_Department_Name + "</td><td>" + item.iapdata_Function_ID_and_Name + "</td><td>" + item.iapdata_Assignable_Square_Feet + "</td></tr>");
				});

				win.document.write("</table>");
				win.document.write('<' + '/' + 'body' + '><' + '/' + 'html' + '>');
				win.document.close();
				win.print();
				win.close();
			}
		});
	}
}

function printMap() {
	var legendLayer = new esri.tasks.LegendLayer();
	legendLayer.layerId = "Rooms";

	var params = new esri.tasks.PrintParameters();
	params.map = map;

	var template = new esri.tasks.PrintTemplate();

	template.format = "PDF";
	template.layout = "Letter ANSI A Landscape";
	var layoutOpts = {
		legendLayers : [legendLayer]
	};
	template.layoutOptions = layoutOpts;
	template.preserveScale = false;

	params.template = template;

	var printTask = new esri.tasks.PrintTask("http://env-gisdev1.uwaterloo.ca:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task");
	printTask.execute(params, function(result) {
		window.open(result.url);
	}, function(errback) {
		alert(errback);
	});
}