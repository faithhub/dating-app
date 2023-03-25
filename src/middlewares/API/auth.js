const apis = require("../../constant/apis.json");
const { User } = require("../../database/models");
const config = require("../../database/config/config.json");
const jwt = require("jsonwebtoken");

module.exports = async function api(req, res, next) {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({
        message: "A token is required for authentication",
      });
    }

    const verifyToken = jwt.verify(token, config.secret);

    if (!verifyToken) {
      return res.status(403).json({
        message: "Invalid auth token",
      });
    }

    const user = await User.findOne({ where: { id: verifyToken.id } });

    if (!user) {
      return res.status(403).json({
        message: "Invalid auth token",
      });
    }

    req.user = verifyToken;
    console.log(new Date(), new Date(user.subExpiredAt));
    if (new Date() > new Date(user.subExpiredAt)) {
      await User.update(
        {
          sub_id: null,
          subDuration: null,
          subExpiredAt: null,
          isSubExpired: true,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    }else{
      await User.update(
        {
          isSubExpired: false,
        },
        {
          where: {
            id: user.id,
          },
        }
      );

    }

    return next();
  } catch (e) {
    return res.status(401).json({
      error: e.message,
      message: "Invalid token",
    });
  }
};
