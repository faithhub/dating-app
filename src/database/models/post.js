"use strict";
const { Model } = require("sequelize");
const { addPagination } = require("../../ultis/db/sequelize.utils");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Image, { as: "image", foreignKey: "imageId" });
      this.belongsTo(models.User, { as: "user", foreignKey: "userId" });
      this.hasMany(models.Like, { foreignKey: "postId" });
    }
  }
  Post.init(
    {
      postId: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
      },
      tag: DataTypes.STRING,
      imageId: DataTypes.STRING,
      userId: DataTypes.STRING,
      likes: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  addPagination(Post);
  return Post;
};
