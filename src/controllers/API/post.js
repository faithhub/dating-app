const { Post, Image, User, Like, Friend } = require("../../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
      ],
    });

    return res.status(200).json({
      message: "All Posts",
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

async function create(req, res) {
  try {
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload the Post Image!" });
    }

    const saveImage = await Image.create({
      name: req.file.filename,
      url: req.file.path,
    });

    const createPost = await Post.create({
      imageId: saveImage.id,
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
    const { id, type } = req.params;

    const likesArray = [];

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

    if (!post) {
      return res.status(404).json({
        message: "No Post found",
      });
    }

    //Get likes
    const likes = await Like.findAll({
      where: { userId: req.user.id },
    });

    //loop likes
    likes.forEach((element) => {
      likesArray.push(element.postId);
    });

    if (type == "like") {
      const friend = await Friend.findOne({
        where: { userId: post.userId, likeId: req.user.id, isMatched: false },
      });

      const user = await Friend.findOne({
        where: { userId: req.user.id, likeId: post.userId, isMatched: false },
      });
      // Check if already like the post
      if (!likesArray.includes(post.id)) {
        console.log(!likesArray.includes(post.id));
        // Save like
        await Like.create({
          postId: post.id,
          userId: req.user.id,
        });

        // Save count
        const param = {
          likes: post.likes + 1,
        };
        await Post.update(param, { where: { id } });

        if (friend) {
          await Friend.update(
            {
              isMatched: true,
            },
            {
              where: {
                userId: post.userId,
                likeId: req.user.id,
                isMatched: false,
              },
            }
          );
          await Friend.create({
            likeId: req.user.id,
            userId: post.userId,
            isMatched: true,
          });

          return res.status(200).json({
            message: "Liked Post",
            isMatch: true,
          });
        }

        if (!user) {
          await Friend.create({
            likeId: req.user.id,
            userId: post.userId,
            isMatched: false,
          });
          return res.status(200).json({
            message: "Liked Post",
            isMatch: false,
          });
        }
        return res.status(200).json({
          message: "Post Liked",
          isMatch: false,
        });
      }

      return res.status(200).json({
        message: "Already like post",
        isMatch: false,
      });
    }

    if (type == "unlike") {
      if (likesArray.includes(post.id)) {
        // Save like
        await Like.destroy({
          where: { postId: post.id, userId: req.user.id },
        });

        // Save count
        const param = {
          likes: post.likes - 1,
        };
        var gg = await Post.update(param, { where: { id } });
      }
      return res.status(200).json({
        message: "Unliked Post",
      });
    }

    return res.status(200).json({
      isMatch: false,
    });

    // const checkLike = await Like.count({
    //   where: { postId: post.id, userId: req.user.id },
    // });

    // if (type == "like") {
    //   if (checkLike == 0) {
    //     // Save like
    //     await Like.create({
    //       postId: post.id,
    //       userId: req.user.id,
    //     });

    //     const param = {
    //       likes: post.likes + 1,
    //     };

    //     await Post.update(param, { where: { id } });
    //   }
    //   // const checkFriend = await Like.count({
    //   //   where: { postId: post.id, userId: req.user.id },
    //   // });
    //   if (checkLike > 0) {
    //     return res.status(200).json({
    //       message: "Already Liked Post",
    //       data: post,
    //     });
    //     // Become friend
    //     await Friend.create({
    //       userId: req.user.id,
    //       posterId: post.userId,
    //     });
    //   }

    //   return res.status(200).json({
    //     message: "Post Liked",
    //     data: post,
    //   });
    // }

    // if (type == "unlike") {
    //   if (checkLike > 0) {
    //     await Like.destroy({
    //       where: { postId: post.id, userId: req.user.id },
    //     });
    //   }

    //   const friend = await Friend.count({
    //     where: { userId: req.user.id, posterId: post.userId },
    //   });

    //   if (friend > 0) {
    //     await Friend.destroy({
    //       where: { userId: req.user.id, posterId: post.userId },
    //     });
    //     return res.status(200).json({
    //       message: "Post Unliked and friend unmatched",
    //       data: post,
    //     });
    //   }

    //   return res.status(200).json({
    //     message: "Post Unliked",
    //     data: post,
    //   });
    // }

    return res.status(200).json({
      message: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

module.exports = { create, getPosts, getPost, deletePost, likeUnlikePost };
