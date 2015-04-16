"use strict";

module.exports = function(sequelize, DataTypes) {

  var BlogPost = sequelize.define("BlogPost", {
    text: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        BlogPost.belongsToMany(models.User, {as: 'UserLikes', through: 'Likes'});
        BlogPost.hasMany(models.Comment, {as: 'Comments'});
      }
    }
  });

  return BlogPost;

};
