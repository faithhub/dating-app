const { Messages } = require("../database/models");
const token = "HERE_WE_GO_AGAIN_DUDE";
module.exports = class {
  static async index(req, res) {
    try {
      if (
        req.query["hub.mode"] == "subscribe" &&
        req.query["hub.verify_token"] == token
      ) {
        res.send(req.query["hub.challenge"]);
      } else {
        res.status(400).json({ msg: "bad request dude" });
      }

      res.status(200).json({ msg: "Good request" });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  static async create(req, res) {
    try {
      const body = req.body;
      const object = req.body.object;
      const info = {
        phone: "8467684638648",
        text: "ghjsvjdvsaj",
        others: req.body,
      };
      await Messages.create(info);
      // if (object == "whatsapp_business_account") {
      //   const messages = body.entry[0].changes[0].value.messages;
      //   messages.map((message) => {
      //     const info = {
      //       phone: message.from,
      //       text: message.text.body,
      //       others: message.text,
      //     };
      //     Messages.create(info).then().catch();
      //   });
      // }

      return res.status(200).json({ msg: "Good one" });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  static async getAll(req, res) {
    try {
      const messages = await Messages.findAll();
      return res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
  }
};
