const { User, Like, Image, Subscription } = require("../../database/models");

async function profile(req, res) {
  try {
    const { params } = req.body;

    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Subscription,
          as: "sub",
        },
        {
          model: Image,
          as: "image",
        },
      ],
      // raw: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    if (user.image) {
      user.avatar = user.image;
    }

    if (user.interests) {
      const userInterestSrg = user.interests;
      user.interests = userInterestSrg.split(",");
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function updateProfile(req, res) {
  try {
    const params = req.body;
    var saveImageId = null;

    console.log(params.interests);

    delete params.phone;
    if (params.interests) {
      params.interests = params.interests.toString();
    }

    if (params.avatar) {
      const postFileName =
        "User_Avatar_" + params.avatar.fileName + "_" + Date.now();
      const saveImage = await Image.create({
        name: postFileName,
        url: params.avatar.url,
      });
      var saveImageId = saveImage.id;
      params.avatar = saveImageId;
    }

    const updateUser = await User.update(params, {
      where: {
        id: req.user.id,
      },
    });

    if (!updateUser) {
      return res.status(403).json({
        message: "An error occur when saving user data",
      });
    }

    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Subscription,
          as: "sub",
        },
        {
          model: Image,
          as: "image",
        },
      ],
    });

    if (user.image) {
      user.avatar = user.image;
    }

    if (user.interests) {
      const userInterestSrg = user.interests;
      user.interests = userInterestSrg.split(",");
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!user.validPassword(currentPassword)) {
      return res.status(400).json({
        message: "Current Password do not match",
      });
    }

    const updateUser = await User.update(
      { password: newPassword },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    if (!updateUser) {
      return res.status(403).json({
        message: "An error occur when updating user password",
      });
    }

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}
module.exports = { updateProfile, profile, updatePassword };
