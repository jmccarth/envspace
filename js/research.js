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

function showResearchers(){
	dojo.byId("showSpacesBtn").disabled = true; //user selection will enable
	dojo.byId("researcherSpaces").innerHTML = "" //TODO: probably a cleaner way to do this
	dojo.byId("researcherList").innerHTML = "" //TODO: probably a cleaner way to do this
	var rQuery = new esri.tasks.Query();
	rQuery.where = "1=1";
	
	var rQueryTask = new esri.tasks.QueryTask(researchersURL);
	rQueryTask.execute(rQuery,function(results){
		for (f in results.features){
			rName = results.features[f].attributes.USERNAME;
			dojo.byId("researcherList").options.add(new Option(rName, rName));
		}
	});
	show('researcherDialog');
}

function listResearcherSpaces(userName){
	dojo.byId("researcherSpaces").innerHTML = "" //TODO: probably a cleaner way to do this
	var rQuery = new esri.tasks.Query();
	rQuery.where = "RESEARCHER = '" + userName + "'";
	rQuery.outFields = ["*"];
	
	var rQueryTask = new esri.tasks.QueryTask(researcherSpaceURL);
	rQueryTask.execute(rQuery,function(results){
		
			dojo.byId("showSpacesBtn").disabled = true; //user selection will enable
			for (f in results.features){
				sID = results.features[f].attributes.SPACE_ID;
				dojo.byId("researcherSpaces").options.add(new Option(sID, sID));
			}
		
	});

}

function populateOccupantView(spaceid){
	var rList = dijit.byId("occList");
	rList.destroyDescendants();
	//query occupant table for that room
	var rQuery = new esri.tasks.Query();
	rQuery.where = "SPACE_ID = '" + spaceid + "'";
	rQuery.outFields = ["*"];
	var rQueryTask = new esri.tasks.QueryTask(occupantSpaceURL);
	rQueryTask.execute(rQuery,function(results){
		for (f in results.features){
			var lItem = new dojox.mobile.ListItem({
				label:results.features[f].attributes.OCCUPANT
			});
			rList.addChild(lItem);
		}
	});
}

function showOccupants(){
	dojo.byId("showSpacesOccBtn").disabled = true; //user selection will enable
	dojo.byId("occupantSpaces").innerHTML = "" //TODO: probably a cleaner way to do this
	dojo.byId("occupantList").innerHTML = "" //TODO: probably a cleaner way to do this
	var rQuery = new esri.tasks.Query();
	rQuery.where = "1=1";
	
	var rQueryTask = new esri.tasks.QueryTask(occupantsURL);
	rQueryTask.execute(rQuery,function(results){
		for (f in results.features){
			rName = results.features[f].attributes.USERNAME;
			dojo.byId("occupantList").options.add(new Option(rName, rName));
		}
	});
	show('occupantDialog');
}

function listOccupantSpaces(userName){
	dojo.byId("occupantSpaces").innerHTML = "" //TODO: probably a cleaner way to do this
	var rQuery = new esri.tasks.Query();
	rQuery.where = "OCCUPANT = '" + userName + "'";
	rQuery.outFields = ["*"];
	
	var rQueryTask = new esri.tasks.QueryTask(occupantSpaceURL);
	rQueryTask.execute(rQuery,function(results){
		
			dojo.byId("showSpacesOccBtn").disabled = true; //user selection will enable
			for (f in results.features){
				sID = results.features[f].attributes.SPACE_ID;
				dojo.byId("occupantSpaces").options.add(new Option(sID, sID));
			}
		
	});

}

