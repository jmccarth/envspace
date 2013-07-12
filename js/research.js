function populateResearcherView(spaceid){
	var rList = dijit.byId("resList");
	rList.destroyDescendants();
	//query researchers table for that room
	var rQuery = new esri.tasks.Query();
	rQuery.where = "SPACE_ID = '" + spaceid + "'";
	
	var rQueryTask = new esri.tasks.QueryTask(researcherSpaceURL);
	rQueryTask.execute(rQuery,function(results){
		for (f in results.features){
			var lItem = new dojox.mobile.ListItem({
				label:results.features[f].attributes.RESEARCHER
			});
			rList.addChild(lItem);
		}
	});
}
