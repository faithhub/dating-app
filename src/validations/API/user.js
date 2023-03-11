const { check, validationResult } = require("express-validator");

exports.validatePassword = [
  check("currentPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Current number can not be empty!"),
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("New Password can not be empty!")
    .bail()
    .isLength({
      min: 6,
    })
    .withMessage("New Password must be minimum 6 length")
    .bail()
    .matches(/(?=.*?[A-Z])/)
    .withMessage("New Password must have at least one Uppercase")
    .matches(/(?=.*?[a-z])/)
    .withMessage("New Password must have at least one Lowercase")
    .matches(/(?=.*?[0-9])/)
    .withMessage("New Password must have at least one Number")
    .matches(/(?=.*?[!@#+$%^&*(),.?":{}|<>])/)
    .withMessage("New Password must have at least one Special character")
    .bail(),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Confirm Password does not match with password");
    }
    return true;
  }),
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
