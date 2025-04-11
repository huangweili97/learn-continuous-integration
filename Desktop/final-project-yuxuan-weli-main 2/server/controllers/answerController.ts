/**
 * @file answerController.ts
 * @description Handles API routes related to answers under /answer/*
 */

import { Router, Request, Response, NextFunction } from "express";
import answerService from "../services/answerService";
import { auth } from "../middleware/auth";

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

/**
 * @route POST /answer/:aid/upvote
 * @description Upvotes an answer (requires authentication)
 * @param {Request} req - Express request object containing the answer ID
 * @param {Response} res - Express response object returning the updated answer
 * @returns {Promise<void>} Responds with the updated answer or an error object
 */
export const upvoteAnswer = async (req: Request, res: Response) => {
  try {
    const answer = await answerService.upvoteAnswer(req.params.aid, req.user._id);
    if (answer) {
      res.json(answer);
    } else {
      res.status(404).json({ error: "Answer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @route POST /answer/:aid/downvote
 * @description Downvotes an answer (requires authentication)
 * @param {Request} req - Express request object containing the answer ID
 * @param {Response} res - Express response object returning the updated answer
 * @returns {Promise<void>} Responds with the updated answer or an error object
 */
export const downvoteAnswer = async (req: Request, res: Response) => {
  try {
    const answer = await answerService.downvoteAnswer(req.params.aid, req.user._id);
    if (answer) {
      res.json(answer);
    } else {
      res.status(404).json({ error: "Answer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 注册路由
router.post("/:aid/upvote", auth, upvoteAnswer);
router.post("/:aid/downvote", auth, downvoteAnswer);

export default router;
