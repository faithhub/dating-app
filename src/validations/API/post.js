const { check, validationResult } = require("express-validator");

exports.createPost = [
  //   check("tag").trim().not().isEmpty().withMessage("Post Tag can not be empty!"),
  (req, res, next) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateCode = [
  check("code")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Code can not be empty!")
    .bail()
    .isNumeric()
    .withMessage("Only numbers are allowed!")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
