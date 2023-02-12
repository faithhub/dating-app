const { check, validationResult } = require("express-validator");
const { User, Course } = require("../database/models");

module.exports = (method) => {
  switch (method) {
    case "updateLecturer":
      {
        return [
          check("course", "Course is required").trim().not().isEmpty(),
          check("name", "The Name is required")
            .trim()
            .isEmpty()
            .isLength({
              min: 3,
            })
            .withMessage("Your name must more than 3 characters long")
            .isLength({
              max: 50,
            })
            .withMessage("Your name must be less than 50 characters long"),
          // check("userId", "The Lecturer ID is required").not().isEmpty(),
          check("email", "The Email is required")
            .trim()
            .isEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("Your email is not valid")
            .isLength({
              max: 50,
            })
            .withMessage("Email must be less than 50 characters long"),
        ];
      }
      break;
    case "createLecturer":
      {
        return [
          check("course", "Course is required").trim().not().isEmpty(),
          check("name", "The Name is required")
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
          check("userId", "The Lecturer ID is required")
            .trim()
            .not()
            .isEmpty()
            .custom((value) => {
              return User.findOne({ where: { username: value } }).then(
                (data) => {
                  if (data) {
                    return Promise.reject("The Lecturer ID already exist");
                  }
                }
              );
            }),
          check("email", "The Email is required")
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
                  return Promise.reject("The email already exist");
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
    case "createStudent":
      {
        return [
          check("name", "The Name is required")
            .trim()
            .isEmpty()
            .isLength({
              min: 3,
            })
            .withMessage("Your name must more than 3 characters long")
            .isLength({
              max: 50,
            })
            .withMessage("Your name must be less than 50 characters long"),
          check("userId", "The Lecturer ID is required")
            .not()
            .isEmpty()
            .custom((value) => {
              return User.findOne({ where: { username: value } }).then(
                (data) => {
                  if (data) {
                    return Promise.reject("The Matric Number already exist");
                  }
                }
              );
            }),
          check("email", "The Email is required")
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
                  return Promise.reject("The email already exist");
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
    case "updateStudent":
      {
        return [
          check("name", "The Name is required")
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
          check("username", "The matric number is required").not().isEmpty(),
          check("email", "The Email is required")
            .trim()
            .not()
            .isEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("Your email is not valid")
            .isLength({
              max: 50,
            })
            .withMessage("Email must be less than 50 characters long"),
        ];
      }
      break;
    case "updateProfile":
      {
        return [
          check("name", "The Name is required")
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
          check("username", "The Admin ID is required").not().isEmpty(),
          check("email", "The Email is required")
            .trim()
            .not()
            .isEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("Your email is not valid")
            .isLength({
              max: 50,
            })
            .withMessage("Email must be less than 50 characters long"),
        ];
      }
      break;
    case "updatePassword":
      {
        return [
          check("currentPassword", "Current Password  is required")
            .trim()
            .escape()
            .not()
            .isEmpty(),
          check("newPassword", "New Password is required")
            .trim()
            .escape()
            .notEmpty()
            .isLength({
              min: 6,
            })
            .withMessage("New Password must be minimum 5 length")
            .matches(/(?=.*?[A-Z])/)
            .withMessage("New Password must have at least one Uppercase")
            .matches(/(?=.*?[a-z])/)
            .withMessage("New Password must have at least one Lowercase")
            .matches(/(?=.*?[0-9])/)
            .withMessage("New Password must have at least one Number"),
          check("confirmPassword", "Confirm Password is required")
            .trim()
            .escape()
            .not()
            .isEmpty()
            .custom((value, { req }) => {
              if (value !== req.body.newPassword) {
                throw new Error("Confirm Password does not match password");
              }
              return true;
            }),
        ];
      }
      break;
    case "createCourse":
      {
        return [
          check("title", "The Coure Name is required")
            .trim()
            .not()
            .isEmpty()
            .isLength({
              min: 3,
            })
            .withMessage("The Course Name must more than 3 characters long")
            .isLength({
              max: 50,
            })
            .custom((value) => {
              return Course.findOne({ where: { title: value } }).then(
                (data) => {
                  if (data) {
                    return Promise.reject("The Course title already exist");
                  }
                }
              );
            }),

          check("code", "The Coure Code is required")
            .trim()
            .not()
            .isEmpty()
            .isLength({
              min: 3,
            })
            .withMessage("The Course Code must more than 3 characters long")
            .isLength({
              max: 50,
            })
            .withMessage("The Course Code must be less than 50 characters long")
            .custom((value) => {
              return Course.findOne({ where: { code: value } }).then((data) => {
                if (data) {
                  return Promise.reject("The Course Code already exist");
                }
              });
            }),
        ];
      }
      break;
    case "updateCourse":
      {
        return [
          check("title", "The Coure Name is required")
            .trim()
            .isEmpty()
            .isLength({
              min: 3,
            })
            .withMessage("The Course Name must more than 3 characters long")
            .isLength({
              max: 50,
            }),

          check("code", "The Coure Code is required")
            .trim()
            .isEmpty()
            .isLength({
              min: 3,
            })
            .withMessage("The Course Code must more than 3 characters long")
            .isLength({
              max: 50,
            })
            .withMessage(
              "The Course Code must be less than 50 characters long"
            ),
        ];
      }
      break;
    case "uploadWork":
      {
        return [
          check("course", "Course is required").trim().not().isEmpty(),
          check("workTile", "The Work Title is required")
            .trim()
            .notEmpty()
            .isLength({
              min: 3,
            })
            .withMessage("Your name must more than 3 characters long")
            .isLength({
              max: 50,
            })
            .withMessage("Your name must be less than 100 characters long"),
          // check("work", "The work file is required").notEmpty(),``
          // .custom((value, { req }) => {
          //   // console.log(value, req.file);
          //   //   if(req.files.mimetype === 'application/pdf'){
          //   //     return '.pdf'; // return "non-falsy" value to indicate valid data"
          //   // }else{
          //   //     return false; // return "falsy" value to indicate invalid data
          //   // }
          //   // if (value !== req.body.password) {
          //   //   throw new Error(
          //   //     "Password confirmation does not match with password"
          //   //   );
          //   // }
          //   //return true;
          // }),
        ];
      }
      break;
  }
};
