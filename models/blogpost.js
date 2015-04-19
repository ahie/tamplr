"use strict";

module.exports = function(sequelize, DataTypes) {

  var BlogPost = sequelize.define("BlogPost", {
    title: DataTypes.STRING,
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
        BlogPost.belongsToMany(models.User, {as: 'UserLikes', through: 'Likes'});
        BlogPost.hasMany(models.Comment, {as: 'Comments'});
      }
    },
    instanceMethods: {
      countLikes: function(callback) {
        this.getUserLikes().then(function(likes) {
          callback(likes.length);
        });
      }
    }
  });

  return BlogPost;

};
