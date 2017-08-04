var models = require('../models/index');
module.exports = function(app){
  //ruta general
  app.get('/', function(req, res, next) {
    res.render('index', {});
  });
  //rutas clientes
  require('./cliente')(app);
  require('./autenticar')(app);
  //rutas administrador
  require('./tipo_imagen')(app);
  require('./adminPanel')(app);
  require('./rubro')(app);
  //rutas proveedor
  require('./proveedor')(app);
  require('./sucursal')(app);
  require('./menu')(app);
  require('./categoria')(app);
};
