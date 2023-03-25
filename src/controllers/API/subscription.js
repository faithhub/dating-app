const { User, Subscription, Transaction } = require("../../database/models");
const moment = require("moment");

async function allSubs(req, res) {
  try {
    const arrSub = [];
    const subs = await Subscription.findAll({ raw: true });

    subs.forEach((element) => {
      element.amount = {
        monthly: element.monthly,
        annually: element.annually,
      };
      const str = element.features;
      const arr = str.split(",").filter((element) => element !== "");
      element.features = arr;
      arrSub.push(element);
      delete element.monthly;
      delete element.annually;
    });

    return res.status(200).json({
      data: subs,
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
    const { duration, subId } = req.body;
    const sub = await Subscription.findOne({ where: { id: subId } });

    if (!sub) {
      return res.status(400).json({
        message: `No Subscription found for this subId ${subId}`,
      });
    }

    let subExpiredAt = null;
    let startDate = new Date();

    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (user.isSubExpired) {
      startDate = new Date();
    } else {
      if (user.subExpiredAt != null) {
        startDate = new Date(user.subExpiredAt);
      } else {
        startDate = new Date();
      }
    }

    params.userId = req.user.id;
    params.planId = sub.id;
    params.amount = sub.amount;

    if (duration == "monthly") {
      endDate = moment(startDate).add(1, "Months").format("YYYY-MM-DD");
      subExpiredAt = new Date(endDate);
    }

    if (duration == "annually") {
      endDate = moment(startDate).add(12, "Months").format("YYYY-MM-DD");
      subExpiredAt = new Date(endDate);
    }

    console.log(subExpiredAt);

    const save = await Transaction.create(params);

    await User.update(
      {
        sub_id: sub.id,
        trans_id: save.id,
        subDuration: duration,
        isSubExpired: false,
        subExpiredAt: subExpiredAt.toJSON(),
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

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
          attributes: ["name", "monthly", "annually"],
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
