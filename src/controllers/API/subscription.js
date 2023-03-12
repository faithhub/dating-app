const { User, Subscription, Transaction } = require("../../database/models");

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

async function saveTransaction(req, res) {
  try {
    const params = req.body;
    const subs = await Subscription.findOne({ where: { id: params.subId } });

    if (!subs) {
      return res.status(400).json({
        message: "No Subscription found for this subId",
      });
    }
    params.userId = req.user.id;
    params.planId = subs.id;
    params.amount = subs.amount;

    const save = await Transaction.create(params);

    if (!save) {
      return res.status(400).json({
        message: "An error occur when saving data, try again!",
      });
    }

    return res.status(200).json({
      message: "Transaction saved successfully",
      data: save,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function transaction(req, res) {
  try {
    const trans = await Transaction.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Subscription,
          as: "sub",
          attributes: ["name", "amount", "duration", "features"],
        },
      ],
    });
    return res.status(200).json({
      data: trans,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

module.exports = { allSubs, saveTransaction, transaction };
