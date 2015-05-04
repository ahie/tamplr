"use strict";

var crypto = require('crypto');

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
    salt: DataTypes.STRING,
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
      set: function(val) {
        var salt = crypto.randomBytes(64).toString('base64');
        this.setDataValue('salt', salt);
        this.setDataValue('password',
          crypto.pbkdf2Sync(val, salt, 4096, 256, 'sha256')
          .toString('hex'));
      }
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
        var hash = crypto.pbkdf2Sync(password, 
          this.getDataValue('salt'), 4096, 256, 'sha256')
          .toString('hex');
        if (hash === this.password) return true;
        return false;
      }
    }
  });

  return User;
};
