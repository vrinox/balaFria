/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('imagen', {
    id_imagen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ruta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mimetype:{
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'imagen'
  });
};
