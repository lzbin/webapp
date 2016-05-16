/*
 * routes.js - module to provide routing
*/
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var configRoutes,
    mongodb = require('mongodb'),
    mongoServer = new mongodb.Server(
        'localhost',
        27017,
        {auto_reconnect:true}
    ),
    dbHandle = new mongodb.Db(
        'spa',mongoServer,{safe:true}
    ),
    makeMongoId = mongodb.ObjectID,
    objTypeMap = {'user':{}};

dbHandle.open(function(err,db){
  if(!err){
    console.log('** Connected to MongoDB **')
  }else{
    console.log(err);
  }
});

//---------------END MODULE SCOPE VARIABLES----------------
//---------------BEGIN PUBLIC METHODS----------------------
configRoutes = function(app,server){
  //all configurations below are for routes
  app.get('/',function(request,response){
    response.redirect('/spa.html');
  });
  app.all('/:obj_type/*?',function(request,response,next){
    response.contentType('json');
    if(objTypeMap[request.params.obj_type]){
      next();
    }else{
      response.send({error_msg:request.params.obj_type + ' is not a valib object type'});
    }
  });
  app.get('/:obj_type/list',function(request,response){
    var collection = dbHandle.collection(request.params.obj_type);
    collection.find({}).toArray(function(err,data){
      if(err){
        throw err;
      }else{
        console.log(data);
        response.send(data);
      }
    });
  });
  app.post('/:obj_type/create',function(request,response){
    dbHandle.collection(
        request.params.obj_type,
        function(outer_error,collection){
          var options_map = {safe:true},
              obj_map = request.body;
          collection.insert(
              obj_map,
              options_map,
              function(inner_error,result_map){
                response.send(result_map);
              }
          )
        }
    );
    response.send({title: 'user created'});
  });
  app.get('/:obj_type/read/:id',function(request,response){
    var find_map = {_id:makeMongoId(request.params.id)};
    dbHandle.collection(
        request.params.obj_type,
        function(outer_error,collection){
          collection.findOne(
              find_map,
              function(inner_error,result_map){
                response.send(result_map);
              }
          )
        }
    )
  });
  app.post('/:obj_type/update/:id',function(request,response){
    var find_map = {_id:makeMongoId(request.params.id)},
        obj_map = request.body;
    dbHandle.collection(
        request.params.obj_type,
        function(outer_error,collection){
          var sort_order = [],
              options_map = {
                'new':true,
                upsert:false,
                safe:true
              };
          collection.findAndModify(
              find_map,
              sort_order,obj_map,
              options_map,
              function(inner_error,updated_map){
                response.send(updated_map);
              }
          );
        }
    )
  });

  app.get('/:obj_type/delete/:id',function(request,response){
    var find_map = {_id:makeMongoId(request.params.id)};
    dbHandle.collection(
        request.params.obj_type,
        function(outer_error,collection){
          var options_map = {safe:true,single:true};
          collection.remove(
              find_map,options_map,
              function(inner_error,delete_count){
                response.send({delete_count:delete_count});
              }
          );
        }
    )
  });
};

module.exports = { configRoutes : configRoutes };

// ----------------- END PUBLIC METHODS -------------------
