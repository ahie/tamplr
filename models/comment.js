"use strict";

module.exports = function(sequelize, DataTypes) {

  var Comment = sequelize.define("Comment", {
    text: DataTypes.STRING,
    author: DataTypes.STRING,
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return Comment;

};
