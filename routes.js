/*
 * routes.js - module to provide routing
*/
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var configRoutes;
//---------------END MODULE SCOPE VARIABLES----------------
//---------------BEGIN PUBLIC METHODS----------------------
configRoutes = function(app,server){
  //all configurations below are for routes
  app.get('/',function(request,response){
    response.redirect('/spa.html');
  });
  app.all('/:obj_type/*',function(request,response,next){
    response.contentType('json');
    next();
  });
  app.get('/:obj_type/list',function(request,response){
    response.send({title:'user list'});
  });
  app.post('/:obj_type/create',function(request,response){
    response.send({title: 'user created'});
  });
  app.get('/user/:obj_type/:id([0-9]+)',function(request,response){
    response.send({title:'user with id'+ request.params.id + ' found'});
  });
};

module.exports = { configRoutes : configRoutes };
// ----------------- END PUBLIC METHODS -------------------
