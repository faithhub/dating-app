const { User, Subscription } = require("../../database/models");

async function allSubs(req, res) {
  try {
    const arrSub = [];
    const subs = await Subscription.findAll({ raw: true });

    subs.forEach((element) => {
      if (element.duration == 1) {
        element.duration = "Monthly";
      }
      if (element.duration == 12) {
        element.duration = "Annual";
      }
      const str = element.features;
      const arr = str.split(",").filter((element) => element !== "");
      element.features = arr;
      arrSub.push(element);
    });

    return res.status(200).json({
      data: arrSub,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

module.exports = { allSubs };
