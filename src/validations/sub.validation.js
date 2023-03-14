const { check, validationResult } = require("express-validator");

exports.createSub = [
  check("name").trim().not().isEmpty().withMessage("Name is required!"),
  check("monthly")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Monthly Amount is required!"),
  check("annually")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Annually Amonut is required!"),
  check("features").trim().not().isEmpty().withMessage("Features is required!"),
  (req, res, next) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
