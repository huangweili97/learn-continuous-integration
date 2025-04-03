/**
 * @file answerController.ts
 * @description Handles API routes related to answers under /answer/*
 */

import { Router, Request, Response, NextFunction } from "express";
import answerService from "../services/answerService";

const router = Router();

/**
 * @route POST /answer/addAnswer
 * @description Adds a new answer to a question
 * @param {Request} req - Express request object containing the question ID and answer data
 * @param {Response} res - Express response object returning the created answer
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Responds with the created answer or an error object
 */
router.post(
  "/addAnswer",
  async (req: Request, res: Response, next: NextFunction) => {
    const { qid, ans } = req.body;

    const validationResult = [];

    /**
     * Validates the existence and type of the question ID
     */
    if (!qid || typeof qid !== "string") {
      validationResult.push({
        path: ".body.pid",
        message: "must exist and be a string",
        errorCode: "type.openapi.validation",
      });
    }

    /**
     * Validates the existence and type of the answer object
     */
    if (!ans || typeof ans !== "object") {
      validationResult.push({
        path: ".body.ans",
        message: "must exist and be a object",
        errorCode: "type.openapi.validation",
      });
    }

    const { text, ans_by, ans_date_time } = ans;

    /**
     * Validates the existence and type of the answer text
     */
    if (!text || typeof text !== "string") {
      validationResult.push({
        path: ".body.ans.text",
        message: "must exist and be a string",
        errorCode: "type.openapi.validation",
      });
    }

    /**
     * Validates the existence and type of the answer author
     */

    if (!ans_by || typeof ans_by !== "string") {
      validationResult.push({
        path: ".body.ans.ans_by",
        message: "must exist and be a string",
        errorCode: "type.openapi.validation",
      });
    }

    /**
     * Validates the existence of the answer timestamp
     */
    if (!ans_date_time) {
      validationResult.push({
        path: ".body.ans.ans_date_time",
        message: "must exist and be a date",
        errorCode: "type.openapi.validation",
      });
    }

    /**
     * If validation fails, returns a 400 error response with the validation details
     */
    if (validationResult.length) {
      return next({
        status: 400,
        message: "Validation failed",
        errors: validationResult,
      });
    }

    try {
      /**
       * Calls the service function to add the answer to the database
       */
      const answer = await answerService.addAnswer(req.body);
      res.json(answer);
    } catch (err) {
      /**
       * Handles unexpected errors and passes them to the next middleware
       */
      console.error("Error while adding answer:", err);
      next({ message: "Internal server error while adding answer" });
    }
  }
);

export default router;
