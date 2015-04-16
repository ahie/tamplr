"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        is: /[a-z][a-z0-9_]*/
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Blog, {as: 'AuthoredBlogs', through: 'BlogAuthors'});
        User.belongsToMany(models.Blog, {as: 'FollowedBlogs', through: 'BlogFollowers'});
        User.belongsToMany(models.BlogPost, {as: 'LikedBlogPosts', through: 'Likes'});
        User.hasMany(models.BlogPost, {as: 'AuthoredPosts'});
        User.hasMany(models.Comment, {as: 'AuthoredComments'});
        User.hasOne(models.Blog, {as: 'DefaultBlog'});
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        if (password === this.password) return true;
        return false;
      }
    }
  });

  return User;
};
