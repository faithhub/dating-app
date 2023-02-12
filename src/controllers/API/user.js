const { User } = require("../../database/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      raw: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "No user found",
      });
    }
    // console.log(__basedir + "/resources/static/assets/uploads/");
    user.interests = JSON.parse(user.interests);
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

    delete params.phone;
    // delete params.interests;

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
      raw: true,
    });

    user.interests = JSON.parse(user.interests);
    return res.status(200).json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
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
