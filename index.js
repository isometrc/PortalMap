var http = require("http");
var fs = require("fs");
var mysql = require("mysql");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var async = require("async");

const port = 8080;
var zonesString = "";

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');

function Zone() {
	this.name = "";
	
	this.conn1Name = "";
	this.conn1Time = new Date();
	this.conn1Size = null;

	this.conn2Name = "";
	this.conn2Time = new Date();
	this.conn2Size = null;

	this.conn3Name = "";
	this.conn3Time = new Date();
	this.conn3Size = null;

	this.conn4Name = "";
	this.conn4Time = new Date();
	this.conn4Size = null;

	this.conn5Name = "";
	this.conn5Time = new Date();
	this.conn5Size = null;

	this.conn5Name = "";
	this.conn5Time = new Date();
	this.conn1Size = null;

	this.conn6Name = "";
	this.conn6Time = new Date();
	this.conn6Size = null;

	this.conn7Name = "";
	this.conn7Time = new Date();
	this.conn7Size = null;

	return this;
};

var zones = new Array();

var con = mysql.createConnection ({
	host: "127.0.0.1",
	user: "mapadmin",
	password: "im the administrator",
	database: "PortalMap",
	multipleStatements: true
});

con.connect((err) => {
	if (err) throw err;
	console.log("[+] Connected to database!");
});

app.listen(port, () => {
	console.log('[+] Listening on port ' + port);
});

app.get('/', (req, res) => {
	//res.sendFile(__dirname + "/index.html");
	res.render("index", {
		statusmessage: "Nothing of note"
	});
});

app.post('/add', (req, res) => {
	insertZone(req.body, res);
});

app.get('/zones', (req, res) => {
	res.render("zones");
});

app.post('/submitzone', (req, res) => {
	insertZone(req.body, res);
});

function insertZone(zone, client)
{
	// Check if the name field is empty
	// If it is, deny request
	if (zone.name == "") {
		client.render("index", {
			statusmessage: "Name field empty!"
		});
		return;
	}

	// Format connection data for sql query
	// Sets empty strings to null and adds quotes for strings
	for (let data in zone) {
		if (zone[data] === '')
			zone[data] = null;
		else
			zone[data] = `'${zone[data]}'`
	}

	// Check if the connection exists
	let _query = `INSERT INTO zones(Name, Conn1Name, Conn1Time, Conn1Size, Conn2Name, Conn2Time, Conn2Size, Conn3Name, Conn3Time, Conn3Size, Conn4Name, Conn4Time, Conn4Size, Conn5Name, Conn5Time, Conn5Size, Conn6Name, Conn6Time, Conn6Size, Conn7Name, Conn7Time, Conn7Size) VALUES(${zone.name}, ${zone.conn1}, ${zone.conn1time}, ${zone.conn1size}, ${zone.conn2}, ${zone.conn2time}, ${zone.conn2size}, ${zone.conn3}, ${zone.conn3time}, ${zone.conn3size}, ${zone.conn4}, ${zone.conn4time}, ${zone.conn4size}, ${zone.conn5}, ${zone.conn5time}, ${zone.conn5size}, ${zone.conn6}, ${zone.conn6time}, ${zone.conn6size}, ${zone.conn7}, ${zone.conn7time}, ${zone.conn7size});`
	 con.query(_query, (err, res, fields) => {
		if (err && err.code == 'ER_DUP_ENTRY') {	
			// Update page
			client.render("index", {
				statusmessage: "Zone exists already!"
			});
			return;
		}
		else if (err)
			throw err;
		
		_query = "SELECT Name FROM zones;";
		con.query(_query, (_err, _res) => {
			if (_err) throw _err;
	
			let _connectionsString = "";
			if(zone.conn1 !== null && _res.find((_element) => {return _element.Name == zone.conn1Name}) == undefined) _connectionsString += "(" + zone.conn1 + ", " + zone.name + ", " + zone.conn1time + ", " + zone.conn1size + "),";
			if(zone.conn2 !== null && _res.find((_element) => {return _element.Name == zone.conn2Name}) == undefined) _connectionsString += "(" + zone.conn2 + ", " + zone.name + ", " + zone.conn2time + ", " + zone.conn2size + "),";
			if(zone.conn3 !== null && _res.find((_element) => {return _element.Name == zone.conn3Name}) == undefined) _connectionsString += "(" + zone.conn3 + ", " + zone.name + ", " + zone.conn3time + ", " + zone.conn3size + "),";
			if(zone.conn4 !== null && _res.find((_element) => {return _element.Name == zone.conn4Name}) == undefined) _connectionsString += "(" + zone.conn4 + ", " + zone.name + ", " + zone.conn4time + ", " + zone.conn4size + "),";
			if(zone.conn5 !== null && _res.find((_element) => {return _element.Name == zone.conn5Name}) == undefined) _connectionsString += "(" + zone.conn5 + ", " + zone.name + ", " + zone.conn5time + ", " + zone.conn5size + "),";
			if(zone.conn6 !== null && _res.find((_element) => {return _element.Name == zone.conn6Name}) == undefined) _connectionsString += "(" + zone.conn6 + ", " + zone.name + ", " + zone.conn6time + ", " + zone.conn6size + "),";
			if(zone.conn7 !== null && _res.find((_element) => {return _element.Name == zone.conn7Name}) == undefined) _connectionsString += "(" + zone.conn7 + ", " + zone.name + ", " + zone.conn7time + ", " + zone.conn7size + "),";			 
			
			_connectionsString = _connectionsString.slice(0, -1);
			if(_connectionsString.length != 0) {
				_query = "INSERT INTO zones(Name, Conn1Name, Conn1Time, Conn1Size) VALUES" + _connectionsString + ";";

				con.query(_query, (__err, __res) => {
					if(__err && __err.code != "ER_DUP_ENTRY") throw __err;

					client.render("index", {
						statusmessage: "Successfully Added!"
					});
					updateZones();
				});
			} else {
				client.render("index", {
					statusmessage: "Successfully Added!"
				});
				updateZones();
			}

			// TODO: For each of the connection names, attempt to update their connection name, time and size to match the input
		 });
	}); 
}

function editZone(zone, response) {
	let _query = "UPDATE zones SET ";
	if(zone.conn1 != '') _query += "Conn1Name='" + zone.conn1 + "',"; else _query += "Conn1Name=null,";
	if(zone.conn1Time !== undefined) _query += "Conn1Time=" + zone.conn1Time + ","; else _query += "Conn1Time=null,";
	if(zone.conn1Size !== undefined) _query += "Conn1Size=" + zone.conn1Size + ","; else _query += "Conn1Size=null,";
	
	if(zone.conn2 !== '') _query += "Conn2Name='" + zone.conn2 + "',"; else _query += "Conn2Name=null,";
	if(zone.conn2Time !== undefined) _query += "Conn2Time=" + zone.conn2Time + ","; else _query += "Conn2Time=null,";
	if(zone.conn2Size !== undefined) _query += "Conn2Size=" + zone.conn2Size + ","; else _query += "Conn2Size=null,";
	
	if(zone.conn3 !== '') _query += "Conn3Name='" + zone.conn3 + "',"; else _query += "Conn3Name=null,";
	if(zone.conn3Time !== undefined) _query += "Conn3Time=" + zone.conn3Time + ","; else _query += "Conn3Time=null,";
	if(zone.conn3Size !== undefined) _query += "Conn3Size=" + zone.conn3Size + ","; else _query += "Conn3Size=null,";
	 
	if(zone.conn4 !== '') _query += "Conn4Name='" + zone.conn4 + "',"; else _query += "Conn4Name=null,";
	if(zone.conn4Time !== undefined) _query += "Conn4Time=" + zone.conn4Time + ","; else _query += "Conn4Time=null,";
	if(zone.conn4Size !== undefined) _query += "Conn4Size=" + zone.conn4Size + ","; else _query += "Conn4Size=null,";

	if(zone.conn5 !== '') _query += "Conn5Name='" + zone.conn5 + "',"; else _query += "Conn5Name=null,";
	if(zone.conn5Time !== undefined) _query += "Conn5Time=" + zone.conn5Time + ","; else _query += "Conn5Time=null,";
	if(zone.conn5Size !== undefined) _query += "Conn5Size=" + zone.conn5Size + ","; else _query += "Conn5Size=null,";
	 
	if(zone.conn6 !== '') _query += "Conn6Name='" + zone.conn6 + "',"; else _query += "Conn6Name=null,";
	if(zone.conn6Time !== undefined) _query += "Conn6Time=" + zone.conn6Time + ","; else _query += "Conn6Time=null,";
	if(zone.conn6Size !== undefined) _query += "Conn6Size=" + zone.conn6Size + ","; else _query += "Conn6Size=null,";
	 
	if(zone.conn7 !== '') _query += "Conn7Name='" + zone.conn7 + "',"; else _query += "Conn7Name=null,";
	if(zone.conn7Time !== undefined) _query += "Conn7Time=" + zone.conn7Time + ","; else _query += "Conn7Time=null,";
	if(zone.conn7Size !== undefined) _query += "Conn7Size=" + zone.conn7Size + ","; else _query += "Conn7Size=null,";

	_query = _query.slice(0, -1);
	_query += " WHERE Name='" + zone.name + "';"

	con.query(_query, (err, res) => {
		if(err) throw err;
		updateZones();
		response.render("index", {statusmessage: "Edit Complete"});
	});
}

function deleteZone(name, response) {
	let _query = "DELETE FROM zones WHERE Name='" + name + "';";
	con.query(_query, (err, res) => {	
		if(err) throw err;
		_query = "UPDATE zones SET Conn1Name=Null, Conn1Time=Null, Conn1Size=Null WHERE Conn1Name='" + name + "';";
		_query += "UPDATE zones SET Conn2Name=Null, Conn2Time=Null, Conn2Size=Null WHERE Conn2Name='" + name + "';";
		_query += "UPDATE zones SET Conn3Name=Null, Conn3Time=Null, Conn3Size=Null WHERE Conn3Name='" + name + "';";
		_query += "UPDATE zones SET Conn4Name=Null, Conn4Time=Null, Conn4Size=Null WHERE Conn4Name='" + name + "';";
		_query += "UPDATE zones SET Conn5Name=Null, Conn5Time=Null, Conn5Size=Null WHERE Conn5Name='" + name + "';";
		_query += "UPDATE zones SET Conn6Name=Null, Conn6Time=Null, Conn6Size=Null WHERE Conn6Name='" + name + "';";
		_query += "UPDATE zones SET Conn7Name=Null, Conn7Time=Null, Conn7Size=Null WHERE Conn7Name='" + name + "';";

		con.query(_query, (_err, _res) => {
			if(_err) throw _err;
			updateZones(response);
		});
	});
	// TODO: Fix the error with the graph not reloading properly when deletion occurs and the zone is updated
}

function updateZones(response) {
	zones = [];

	let _query = "SELECT * FROM zones;"
	con.query(_query, (err, res) => {
		if (err) reject(err);
			
		for (let _data in res) {
			let _zone = new Zone();
			_zone.name = res[_data].Name;
			_zone.conn1Name = res[_data].Conn1Name;
			_zone.conn1Time = res[_data].Conn1Time;
			_zone.conn1Size = res[_data].Conn1Size;
				
			_zone.conn2Name = res[_data].Conn2Name;
			_zone.conn2Time = res[_data].Conn2Time;
			_zone.conn2Size = res[_data].Conn2Size;
				
			_zone.conn3Name = res[_data].Conn3Name;
			_zone.conn3Time = res[_data].Conn3Time;
			_zone.conn3Size = res[_data].Conn3Size;

			_zone.conn4Name = res[_data].Conn4Name;
			_zone.conn4Time = res[_data].Conn4Time;
			_zone.conn4Size = res[_data].Conn4Size;

			_zone.conn5Name = res[_data].Conn5Name;
			_zone.conn5Time = res[_data].Conn5Time;
			_zone.conn5Size = res[_data].Conn5Size;

			_zone.conn6Name = res[_data].Conn6Name;
			_zone.conn6Time = res[_data].Conn6Time;
			_zone.conn6Size = res[_data].Conn6Size;

			_zone.conn7Name = res[_data].Conn7Name;
			_zone.conn7Time = res[_data].Conn7Time;
			_zone.conn7Size = res[_data].Conn7Size;

			zones.push(_zone);
		}
	
		zonesString =  JSON.stringify(zones);
		
		if (response !== undefined) response.send(zonesString);
	});
}

app.get("/getzones", (req, res) => {
	updateZones(res);
});

app.post("/delete", (req, res) => {
	deleteZone(req.body.name, res);
});

app.post("/edit", (req, res) => {
	editZone(req.body, res);
});
