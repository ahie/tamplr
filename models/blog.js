"use strict";

module.exports = function(sequelize, DataTypes) {
  var Blog = sequelize.define("Blog", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING
    },
    isDefaultBlog: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Blog.belongsToMany(models.User, {as: 'Authors', through: 'BlogAuthors'});
        Blog.belongsToMany(models.User, {as: 'Followers', through: 'BlogFollowers'});
        Blog.hasMany(models.BlogPost, {as: 'BlogPosts'});
      }
    }
  });

  return Blog;
};
