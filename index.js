var path = require('path');
var fs = require('fs');
var https = require('https');
var scriptDir = path.dirname(process.argv[1]);
process.chdir(scriptDir);
var cfg = require('./config.js');
var express = require('express');
var app = express();
var privateKey = fs.readFileSync(cfg.core.key);
var cert = fs.readFileSync(cfg.core.cert);
var ca = fs.readFileSync(cfg.core.ca);
var Hipchat = require('node-hipchat');
var hipchat = new Hipchat(cfg.HipChat.token);
var inspect = require('util').inspect;

app.use(express.json());
app.use(express.urlencoded());
app.post('/hipchat', handleGetHipChat);

var credentials = {key: privateKey, cert: cert, ca: ca};
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(cfg.core.port);
console.log('Server listening on ' + inspect(httpsServer.address()));

function handleGetHipChat(req, res) {
	logReq(req, res);
	var body = req.body;
	var from;
	var color;
	var msg;
	var room;
	//console.log("Body: " + inspect(body));
	//console.log("Headers: " + inspect(req.headers));
	if(body == undefined || body.length == 0) {
		res.send(400, 'Body is required');
		console.log("Body is undefined");
		return;
	}
	if(body.msg == undefined) {
		res.send(400, 'Need moar message!');
		console.log("Message is undefined");
		return;
	}
	if(body.room == undefined) {
		res.send(400, 'Need a room number');
		console.log("Room is undefined");
		return;
	}
	from = (body.from != undefined ? body.from : 'Mystery Penguin');
	color = (body.color != undefined ? body.color.toLowerCase() : 'random');
	msg = body.msg;
	room = body.room;
	var params = {
		room: room,
		from: from,
		message: msg,
		color: color
	}
	hipchat.postMessage(params, function(theD, err) {
		console.log("Posted message. The data: " + inspect(theD));
		console.log("The error: " + inspect(err));
	});
	res.send('Thanks!' + "\n");
}

function logReq(req, res) {
	console.log(req.ip + ' - ' + req.originalUrl);
}
