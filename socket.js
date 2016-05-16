/*
* socket.js
*/
/*global*/
//---------------------BEGIN MODULE SCOPE VARIABLES ---------------
'use strict';
var setWatch,
    http = require('http'),
    fs = require('fs'),
    express = require('express'),
    socketIo = require('socket.io'),
    fsHandle = require('fs'),
    app = express(),
    server = http.createServer(app),
    io = socketIo.listen(server),
    watchMap = {};
//----------------------END MODULE SCOPE VARIABLES----------------------
//----------------------BEGIN UTILITY METHODS-------------------------
setWatch = function( url_path,file_type){
    console.log('setWatch called on '+ url_path);

    if( !watchMap[url_path]){
        console.log('setting watch on '+ url_path);

        fsHandle.watchFile(
            url_path.slice(1),
            function(current,previous){
                console.log('file accessed');
                if(current.mtime !== previous.mtime){
                    console.log('file changed');
                    /*fs.readFile(__dirname + url_path,{encoding:'utf-8'}, function (error, fileData) {
                        if (error) {
                            console.log(error);
                        }
                        io.sockets.emit(file_type,fileData);
                    });*/
                    io.sockets.emit(file_type,url_path);
                }
            }
        );
        watchMap[url_path] = true;
    }
};
//-----------------------END UTILITY METHODS------------------------
//-----------------------BEGIN SERVER CONFIGURATION---------------------
app.use(function(request,response,next){
    if(request.url.indexOf('/js/') >= 0 ){
        setWatch( '/public' + request.url,'script');
    }else if(request.url.indexOf('/css/') >= 0 ){
        setWatch('/public' + request.url,'stylesheet');
    }
    next();
});
app.use(express.static(__dirname + '/public'));

app.get('/',function(require,response){
    response.redirect('/socket.html');
});
//-------------------------END SERVER CONFIGURATION-------------------------
//-------------------------BEGIN START SERVER------------------------------
server.listen(3000);
console.log('Express server listening on port %d in %s mode',server.address().port,app.settings.env);
//--------------------------END START SERVER-------------------------------