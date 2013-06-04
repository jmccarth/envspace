function showAssignment(OID) {
	var relQuery = new esri.tasks.RelationshipQuery();
	relQuery.outFields = ["RESEARCHER"];
	relQuery.relationshipId = 0;
	relQuery.objectIds = [OID];
	roomsLayer.queryRelatedFeatures(relQuery, function(relatedRecords) {
		alert(relatedRecords.length);
	});
}