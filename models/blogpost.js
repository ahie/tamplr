"use strict";

module.exports = function(sequelize, DataTypes) {

  var BlogPost = sequelize.define("BlogPost", {
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    author: DataTypes.STRING,
    inBlog: DataTypes.STRING,
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    classMethods: {
      associate: function(models) {
        BlogPost.belongsToMany(models.User, {as: 'UserLikes', through: 'Likes'});
        BlogPost.hasMany(models.Comment, {as: 'Comments'});
        BlogPost.belongsTo(models.Blog);
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
