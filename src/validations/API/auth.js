const { check, validationResult } = require("express-validator");

exports.validateRegistration = [
  check("phone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone number can not be empty!")
    .bail()
    .isNumeric()
    .withMessage("Only numbers are allowed!")
    .bail()
    .isLength({ min: 11 })
    .withMessage("Minimum 11 characters required!")
    .bail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password can not be empty!")
    .bail()
    .isLength({
      min: 6,
    })
    .withMessage("Password must be minimum 6 length")
    .bail()
    .matches(/(?=.*?[A-Z])/)
    .withMessage("Password must have at least one Uppercase")
    .matches(/(?=.*?[a-z])/)
    .withMessage("Password must have at least one Lowercase")
    .matches(/(?=.*?[0-9])/)
    .withMessage("Password must have at least one Number")
    .matches(/(?=.*?[!@#+$%^&*(),.?":{}|<>])/)
    .withMessage("Password must have at least one Special character")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateLogin = [
  check("phone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone number can not be empty!")
    .bail()
    .isNumeric()
    .withMessage("Only numbers are allowed!")
    // .bail()
    // .isLength({ min: 11 })
    // .withMessage("Minimum 11 characters required!")
    .bail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password can not be empty!")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validatePhone = [
  check("phone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone number can not be empty!")
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
