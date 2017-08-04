var models = require('../models/index');

module.exports = function(app){
  //obtener menus de un proveedor
  app.get('/api/menus/:id', function(req, res) {
    models.menu.findAll({where:{"id_proveedor":req.params.id}}).then(function(menus) {
      res.json(menus);
    });
  });
  //guardar registro
  app.post('/api/menus', function(req, res) {
    models.menu.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      id_proveedor: req.body.id_proveedor
    })
    .then(function(menu){
        res.json(menu);
    });
  });
  //buscar uno solo
  app.get('/api/menu/:id', function(req, res) {
    models.menu.find({
      where: {
        id_menu: req.params.id
      }
    }).then(function(menu) {
      models.sequelize.query("select dm.*,c.*,i.* from detalle_menu dm "+
                              "join categoria c on dm.id_categoria = c.id_categoria "+
                              "join imagen_categoria ic on c.id_categoria = ic.id_categoria and ic.estado = 'A' "+
                              "join imagen i on ic.id_imagen =i.id_imagen ",
        { model: models.detalle_menu}
      ).then(result =>{
        menu.dataValues.categorias = result;
        res.json(menu);
      });
    });
  });
  //modificar
  app.put('/api/menu/:id', function(req, res) {
    models.menu.find({
      where: {
        id_menu: req.params.id
      }
    }).then(function(menu) {
      if(menu){
        menu.updateAttributes({
          nombre: req.body.nombre,
          descripcion: req.body.descripcion
        }).then(function(menu) {
          res.send(menu);
        });
      }
    });
  });
  // delete a single menu
  app.delete('/api/menu/:id', function(req, res) {
    models.menu.destroy({
      where: {
        id_menu: req.params.id
      }
    }).then(function(menu) {
      res.json(menu);
    });
  });
  //asociar categoria a menu
  app.put('/api/menus/cambiarCategoria', function(req, res) {
    models.menu_sucursal.find({where:{id_sucursal:req.body.id_sucursal}})
    .then(function(menu_sucursal){
      models.detalle_menu.create({
        id_categoria: req.body.id_categoria,
        id_menu: menu_sucursal.id_menu
      })
      .then(function(menu){
          res.json(menu);
      });
    })
  });
};