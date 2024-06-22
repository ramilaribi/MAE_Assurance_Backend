import { body } from "express-validator";
export const feedbackValidationRules = [
  body("name")
      .trim()
      .notEmpty()
      .withMessage("Please make sure to add your Name"),
  body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email address. Please verify your email"),
  body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ max: 1000 })
      .withMessage("Message must not exceed 1000 characters")
];

