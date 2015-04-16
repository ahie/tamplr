"use strict";

module.exports = function(sequelize, DataTypes) {

  var Comment = sequelize.define("Comment", {
    text: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return Comment;

};
