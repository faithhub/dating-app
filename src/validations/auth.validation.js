const { check, validationResult } = require("express-validator");
const { User } = require("../database/models");

module.exports = (method) => {
  switch (method) {
    case "login":
      {
        return [
          check("username", "The Matric Number or User Id is required")
            .not()
            .isEmpty(),
          check("password", "The Password is required").not().isEmpty(),
        ];
      }
      break;
    case "register":
      {
        return [
          check("name", "Name is required")
            .trim()
            .not()
            .isEmpty()
            .isLength({
              min: 3,
            })
            .withMessage("Your name must more than 3 characters long")
            .isLength({
              max: 50,
            })
            .withMessage("Your name must be less than 50 characters long"),
          check("matric", "The Matric Number is required")
            .not()
            .isEmpty()
            .custom((value) => {
              return User.findOne({ where: { username: value } }).then(
                (data) => {
                  if (data) {
                    return Promise.reject("Matric Number already exist");
                  }
                }
              );
            }),
          check("email", "Email is required")
            .trim()
            .not()
            .isEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("Your email is not valid")
            .isLength({
              max: 50,
            })
            .withMessage("Email must be less than 50 characters long")
            .custom((value) => {
              return User.findOne({ where: { email: value } }).then((data) => {
                if (data) {
                  return Promise.reject("The email address already exist");
                }
              });
            }),
          check("password", "The Password is required")
            .not()
            .isEmpty()
            .isLength({
              min: 6,
            })
            .withMessage("Password must be minimum 5 length")
            .matches(/(?=.*?[A-Z])/)
            .withMessage("Password must have at least one Uppercase")
            .matches(/(?=.*?[a-z])/)
            .withMessage("Password must have at least one Lowercase")
            .matches(/(?=.*?[0-9])/)
            .withMessage("Password must have at least one Number"),
          check("confirmPassword", "The Confrim Password is required")
            .not()
            .isEmpty()
            .custom((value, { req }) => {
              if (value !== req.body.password) {
                throw new Error(
                  "Password confirmation does not match with password"
                );
              }
              return true;
            }),
        ];
      }
      break;
  }
};
