var zones = new Array();

function deleteZone() {
	let _name = $("#name").val();	
	$.post("/delete", {name: _name}, (response) => {
		getZones();
	});
}

function editModal(add, zoneInfo) {
	// Setup timepicker
	$(".timepicker").timepicker({
		timeFormat: "hh:mm:ss",
		startTime: "00:00:00"
	});

	// Show the edit modal and fill in the text if the information is not empty
	$("#name").val("");
	$("#conn1").val("");
	$("#conn1time").val("");
	$("#conn1size").val("");

	$("#conn2").val("");
	$("#conn2time").val("");
	$("#conn2size").val("");

	$("#conn3").val("");
	$("#conn3time").val("");
	$("#conn3size").val("");

	$("#conn4").val("");
	$("#conn4time").val("");
	$("#conn4size").val("");

	$("#conn5").val("");
	$("#conn5time").val("");
	$("#conn5size").val("");

	$("#conn6").val("");
	$("#conn6time").val("");
	$("#conn6size").val("");
	
	$("#conn7").val("");
	$("#conn7time").val("");
	$("#conn7size").val("");


	$("#dimmer").attr("style", "display: block");
	$("#editModal").attr("style", "display: block");
	
	if(add) {
		$("#delete").hide();
		$("#cancel").attr("style", "flex: 50%; width: 50%");
		$("#submit").attr("style", "flex: 50%; width: 50%");
		$("#zoneInfo").attr("action", "/add");
		$("#name").prop("readonly", false);
	} else {
		$("#zoneInfo").attr("action", "/edit");
		$("#name").prop("readonly", true);
	}
	
	if(zoneInfo === undefined) {
		return;	
	}

	$("#name").val(zoneInfo.name);
	$("#conn1").val(zoneInfo.conn1Name);
	$("#conn1time").val(zoneInfo.conn1Time);
	$("#conn1size").val(zoneInfo.conn1Size);

	$("#conn2").val(zoneInfo.conn2Name);
	$("#conn2time").val(zoneInfo.conn2Time);
	$("#conn2size").val(zoneInfo.conn2Size);

	$("#conn3").val(zoneInfo.conn3Name);
	$("#conn3time").val(zoneInfo.conn3Time);
	$("#conn3size").val(zoneInfo.conn3Size);

	$("#conn4").val(zoneInfo.conn4Name);
	$("#conn4time").val(zoneInfo.conn4Time);
	$("#conn4size").val(zoneInfo.conn4Size);

	$("#conn5").val(zoneInfo.conn5Name);
	$("#conn5time").val(zoneInfo.conn5Time);
	$("#conn5size").val(zoneInfo.conn5Size);

	$("#conn6").val(zoneInfo.conn6Name);
	$("#conn6time").val(zoneInfo.conn6Time);
	$("#conn6size").val(zoneInfo.conn6Size);
	
	$("#conn7").val(zoneInfo.conn7Name);
	$("#conn7time").val(zoneInfo.conn7Time);
	$("#conn7size").val(zoneInfo.conn7Size);
}

function hideEditModal() {
	$("#editModal").attr("style", "display: none");
	$("#dimmer").attr("style", "display: none");
}

function getZones() {
	$.ajax({
		url: "/getzones",
		type: "GET",
		dataType: 'json',
		success: function(result) {
			zones = result;
			redrawGraph();
		}
	});
}

function redrawGraph() {
	var _canvas = document.getElementById("canvas");
	var _g = new Dracula.Graph();
				
	for(let _i = 0; _i < zones.length; _i++) {
		let _zone = zones[_i];

		// Make edge labels
		let _conn1Label = _zone.conn1Time + "\n" + _zone.conn1Size + " people";
		let _conn2Label = _zone.conn2Time + "\n" + _zone.conn2Size + " people";
		let _conn3Label = _zone.conn3Time + "\n" + _zone.conn3Size + " people";
		let _conn4Label = _zone.conn4Time + "\n" + _zone.conn4Size + " people";
		let _conn5Label = _zone.conn5Time + "\n" + _zone.conn5Size + " people";
		let _conn6Label = _zone.conn6Time + "\n" + _zone.conn6Size + " people";
		let _conn7Label = _zone.conn7Time + "\n" + _zone.conn7Size + " people";

		let _node = _g.addNode(_zone.name, {label: _zone.name});
		if (_zone.conn1Name != "" && _zone.conn1Name != null) var _conn1 = _g.addNode(_zone.conn1Name, {label: _zone.conn1Name});
		if (_zone.conn2Name != "" && _zone.conn2Name != null) var _conn2 = _g.addNode(_zone.conn2Name, {label: _zone.conn2Name});
		if (_zone.conn3Name != "" && _zone.conn3Name != null) var _conn3 = _g.addNode(_zone.conn3Name, {label: _zone.conn3Name});
		if (_zone.conn4Name != "" && _zone.conn4Name != null) var _conn4 = _g.addNode(_zone.conn4Name, {label: _zone.conn4Name});
		if (_zone.conn5Name != "" && _zone.conn5Name != null) var _conn5 = _g.addNode(_zone.conn5Name, {label: _zone.conn5Name});
		if (_zone.conn6Name != "" && _zone.conn6Name != null) var _conn6 = _g.addNode(_zone.conn6Name, {label: _zone.conn6Name});
		if (_zone.conn7Name != "" && _zone.conn7Name != null) var _conn7 = _g.addNode(_zone.conn7Name, {label: _zone.conn7Name});

		if (_zone.conn1Name != "" && _zone.conn1Name != null) _g.addEdge(_node, _conn1, {style: {label: _conn1Label}});
		if (_zone.conn2Name != "" && _zone.conn2Name != null) _g.addEdge(_node, _conn2, {style: {label: _conn2Label}});
		if (_zone.conn3Name != "" && _zone.conn3Name != null) _g.addEdge(_node, _conn3, {style: {label: _conn3Label}});
		if (_zone.conn4Name != "" && _zone.conn4Name != null) _g.addEdge(_node, _conn4, {style: {label: _conn4Label}});
		if (_zone.conn5Name != "" && _zone.conn5Name != null) _g.addEdge(_node, _conn5, {style: {label: _conn5Label}});
		if (_zone.conn6Name != "" && _zone.conn6Name != null) _g.addEdge(_node, _conn6, {style: {label: _conn6Label}});
		if (_zone.conn7Name != "" && _zone.conn7Name != null) _g.addEdge(_node, _conn7, {style: {label: _conn7Label}});
	}

	var _layouter = new Dracula.Layout.Spring(_g);
	_layouter.layout();
		
	var _renderer = new Dracula.Renderer.Raphael(_canvas, _g, document.documentElement.clientWidth, 1000);
	_renderer.draw();		

	// Change the height back to 500px and make it scrollable with the mouse
	$("#canvas").height(500);
	//TODO: allow scrolling of the div by drag and drop

	var _textContainers = _canvas.querySelectorAll("tspan");
	for(let _textObject in _textContainers) {
		let _text = _textContainers[_textObject];
		for(let _x in _g.nodes) {
			if(_text.textContent == _g.nodes[_x].label) {
				_text.onclick = function () {
					let _zoneInfo = zones.find((_element) => {return _element.name == _text.textContent});
					if(_zoneInfo == undefined) {
						let _newZone = {};
						_newZone.name = _text.textContent;
						_zoneInfo = _newZone;
						editModal(false, _zoneInfo);
					}
					else
						editModal(false, _zoneInfo);
				};
			}
		}
	}
}

$(document).ready(function() {
	getZones();		
});

