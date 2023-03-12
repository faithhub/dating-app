const {
  Post,
  Image,
  User,
  Like,
  Friend,
  UserLikes,
} = require("../../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const uploadSavedDir = "/" + "storage" + "/" + "images/";
const uploadDir = "src" + "/" + "public" + "/" + "storage" + "/" + "images/";
const fs = require("fs");

async function allPosts(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 12;

    const posts = await Post.paginate(page, limit, {
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["url"],
        },
        {
          model: User,
          as: "user",
          attributes: [
            "name",
            "phone",
            "email",
            "dob",
            "isActive",
            "acc_status",
            "account_purpose",
            "avatar",
            "location",
            "longitude",
            "latitude",
            "distance_preference",
            "isCompleteReg",
            "plan_id",
          ],
          include: [
            {
              model: Image,
              as: "image",
            },
          ],
        },
      ],
    });

    var likedPosts = [];

    var user = await UserLikes.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (user) {
      var likedPosts = user.likedPosts.split(",");
      var likedPosts = likedPosts.map(Number);
    }

    return res.status(200).json({
      message: "All Posts",
      likedPosts: likedPosts,
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when fetching posts",
      error: error.message,
    });
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const post = await Post.destroy({
      where: { id, userId: req.user.id },
    });

    if (!post) {
      return res.status(404).json({
        message: "No Post found",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when fetching post",
      error: error.message,
    });
  }
}

async function getPost(req, res) {
  try {
    const { id } = req.params;

    const post = await Post.findAll({
      where: { id, userId: req.user.id },
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["url"],
        },
        {
          model: User,
          as: "user",
          attributes: [
            "name",
            "phone",
            "email",
            "dob",
            "isActive",
            "acc_status",
            "account_purpose",
            "avatar",
            "location",
            "longitude",
            "latitude",
            "distance_preference",
            "isCompleteReg",
            "plan_id",
          ],
          include: [
            {
              model: Image,
              as: "image",
            },
          ],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: "No Post found",
      });
    }

    return res.status(200).json({
      message: "Post",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when fetching post",
      error: error.message,
    });
  }
}

async function getPosts(req, res) {
  try {
    const posts = await Post.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["url"],
        },
        {
          model: User,
          as: "user",
          attributes: [
            "name",
            "phone",
            "email",
            "dob",
            "isActive",
            "acc_status",
            "account_purpose",
            "avatar",
            "location",
            "longitude",
            "latitude",
            "distance_preference",
            "isCompleteReg",
            "plan_id",
          ],
          include: [
            {
              model: Image,
              as: "image",
            },
          ],
        },
      ],
    });

    var likedPosts = [];

    var user = await UserLikes.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (user) {
      var likedPosts = user.likedPosts.split(",");
      var likedPosts = likedPosts.map(Number);
    }

    return res.status(200).json({
      message: "All Posts",
      likedPosts: likedPosts,
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when fetching posts",
      error: error.message,
    });
  }
}

async function likedPosts(req, res) {
  try {
    var likedPosts = [];
    var posts = [];

    var user = await UserLikes.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (user) {
      var matchedUsers = user.matchedUsers.split(",");
      var matchedUsers = matchedUsers.map(Number);
      var likedPosts = user.likedPosts.split(",");
      var likedPosts = likedPosts.map(Number);

      var posts = await Post.findOne({
        where: {
          id: {
            [Sequelize.Op.in]: likedPosts,
          },
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id"],
          },
        ],
      });
    }

    return res.status(200).json({
      message: "All likes posts",
      postIds: likedPosts,
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when fetching liked posts",
      error: error.message,
    });
  }
}

async function create(req, res) {
  try {
    function getFileExtension(filename) {
      // get file extension
      const extension = filename.split(".").pop();
      return extension;
    }

    const { tag } = req.body;

    if (req.files == undefined) {
      return res.status(400).send({ message: "Please upload the Post Image!" });
    }

    if (!req.files.image) {
      return res.status(400).send({ message: "Please upload the Post Image!" });
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    var image = req.files.image;
    var imageName =
      "Image" + "_" + Date.now() + "." + getFileExtension(image.name);
    const imagePath = uploadDir + imageName;
    image.mv(imagePath, (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
    });
    const fullUrl = req.headers.host;
    const filePath = fullUrl + uploadSavedDir + imageName;

    const saveImage = await Image.create({
      name: imageName,
      // url: req.file.path,
      url: filePath,
    });

    const createPost = await Post.create({
      imageId: saveImage.id,
      tag: tag,
      userId: req.user.id,
    });

    const post = await Post.findOne({
      where: { id: createPost.id },
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["url"],
        },
      ],
    });

    return res.status(200).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when creating post",
      error: error,
    });
  }
}

async function likeUnlikePost(req, res) {
  try {
    var isMatch = false;
    var msg = "Already liked post";
    const { id, type } = req.params;

    // Check if post does exist
    const post = await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id"],
        },
      ],
    });

    //Return if not exist
    if (!post) {
      return res.status(404).json({
        message: "No Post found",
      });
    }

    //Get all user's likes
    var user = await UserLikes.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (!user) {
      var user = await UserLikes.create({
        userId: req.user.id,
      });
    }

    if (req.user.id != post.userId) {
      var postOwner = await UserLikes.findOne({
        where: {
          userId: post.userId,
        },
      });

      if (!postOwner) {
        var postOwner = await UserLikes.create({
          userId: post.userId,
        });
      }

      var postOwnerLikedUsers = postOwner.likedUsers.split(",");
      var postOwnerMatchedUsers = postOwner.matchedUsers.split(",");

      var postOwnerLikedUsers = postOwnerLikedUsers.map(Number);
      var postOwnerMatchedUsers = postOwnerMatchedUsers.map(Number);
    }

    var likedPosts = user.likedPosts.split(",");
    var likedUsers = user.likedUsers.split(",");
    var matchedUsers = user.matchedUsers.split(",");

    var likedPosts = likedPosts.map(Number);
    var likedUsers = likedUsers.map(Number);
    var matchedUsers = matchedUsers.map(Number);

    if (type == "like") {
      if (!likedPosts.includes(parseInt(post.id))) {
        likedPosts.push(parseInt(post.id));
        // Save count
        const param = {
          likes: post.likes + 1,
        };
        await Post.update(param, { where: { id } });
        msg = "Post liked";
      }

      if (req.user.id != post.userId) {
        //if they're already matched
        if (!matchedUsers.includes(parseInt(post.userId))) {
          if (likedUsers.includes(parseInt(post.userId))) {
            matchedUsers.push(parseInt(post.userId));
            postOwnerMatchedUsers.push(req.user.id);
            isMatch = true;
          } else {
            if (!postOwnerLikedUsers.includes(req.user.id)) {
              console.log(postOwnerLikedUsers, req.user.id);
              postOwnerLikedUsers.push(req.user.id);
            }
          }
        }
      }

      await UserLikes.update(
        {
          likedPosts: likedPosts.toString(),
          likedUsers: likedUsers.toString(),
          matchedUsers: matchedUsers.toString(),
        },
        { where: { userId: req.user.id } }
      );

      if (req.user.id != post.userId) {
        await UserLikes.update(
          {
            likedUsers: postOwnerLikedUsers.toString(),
            matchedUsers: postOwnerMatchedUsers.toString(),
          },
          { where: { userId: post.userId } }
        );
      }

      return res.status(200).json({
        message: msg,
        isMatch: isMatch,
      });
    }

    if (type == "unlike") {
      if (likedPosts.includes(parseInt(post.id))) {
        likedPosts.push(parseInt(post.id));
        // deduct count
        const param = {
          likes: post.likes - 1,
        };
        await Post.update(param, { where: { id } });
        msg = "Unliked Post";
      }

      return res.status(200).json({
        msg: "Unliked Post",
        isMatch: isMatch,
      });
    }

    return res.status(200).json({
      isMatch: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function matches(req, res) {
  try {
    var user = await UserLikes.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (!user) {
      return res.status(200).json({
        matches: null,
      });
    }

    var matchedUsers = user.matchedUsers.split(",");
    var matchedUsers = matchedUsers.map(Number);

    const matches = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: matchedUsers,
        },
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Image,
          as: "image",
        },
      ],
    });
    return res.status(200).json({
      matches: matches,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

module.exports = {
  create,
  getPosts,
  getPost,
  deletePost,
  likeUnlikePost,
  allPosts,
  likedPosts,
  matches,
};
