/*
* socket.js
*/
/*global*/
//---------------------BEGIN MODULE SCOPE VARIABLES ---------------
'use strict';
var countUp,
    http = require('http'),
    express = require('express'),
    socketIo = require('socket.io'),
    app = express(),
    server = http.createServer(app),
    io = socketIo.listen(server),
    countIdx = 0;
//----------------------END MODULE SCOPE VARIABLES----------------------
//----------------------BEGIN UTILITY METHODS-------------------------
countUp = function(){
    countIdx++;
    console.log(countIdx);
    io.sockets.send(countIdx);
};
//-----------------------END UTILITY METHODS------------------------
//-----------------------BEGIN SERVER CONFIGURATION---------------------
app.use(express.static(__dirname + '/public'));

app.get('/',function(require,response){
    response.redirect('/socket.html');
});
//-------------------------END SERVER CONFIGURATION-------------------------
//-------------------------BEGIN START SERVER------------------------------
server.listen(3000);
console.log('Express server listening on port %d in %s mode',server.address().port,app.settings.env);

setInterval(countUp,1000);
//--------------------------END START SERVER-------------------------------