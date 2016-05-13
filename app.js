/*
 * app.js - Express server with basic auth
 */

/*jslint         node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var http = require( 'http'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    errorhandler = require('errorhandler'),
    express = require( 'express'),
    auth = require('basic-auth'),
    io = require('socket.io'),
    routes = require( './routes'),

    app = express(),
    server = http.createServer( app );
// ------------- END MODULE SCOPE VARIABLES ---------------
// ------------- BEGIN SERVER CONFIGURATION ---------------
var env = app.get('env');

app.use(bodyParser());
app.use(methodOverride());

app.use(function(req, res, next) {
    var user = auth(req);

    if (user === undefined || user['name'] !== 'spa' || user['pass'] !== 'spa') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
        res.end('Unauthorized');
    } else {
        next();
    }
});

app.use(express.static(__dirname + '/public'));
//app.use(app.router);

if('development' == env){
    //app.use(logger());
    app.use(errorhandler({
            dumpExceptions: true,
            showStrack : true
        }
    ));
}

if('production' == env){
    app.use(errorhandler());
}
routes.configRoutes(app,server);
//---------------END SERVER CONFIGURATION------------------
//---------------BEGIN START SERVER----------------------
server.listen(3000);
console.log('Express server listening on port %d in %s mode',server.address().port,app.settings.env);
//----------------END START SERVER-------------------
