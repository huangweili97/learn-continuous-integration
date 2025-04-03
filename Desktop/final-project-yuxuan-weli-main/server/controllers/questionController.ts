/**
 * @file questionController.ts
 * @description Handles API routes related to questions under /question/*
 */
import { Router, Request, Response, NextFunction } from "express";
import questionService from "../services/questionService";

const router = Router();

/**
 * @route POST /question/addQuestion
 * @description Adds a new question to the database
 * @param {Request} req - Express request object containing question details
 * @param {Response} res - Express response object returning the created question
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Responds with the created question or an error object
 */
router.post(
  "/addQuestion",
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, text, tags, asked_by, ask_date_time } = req.body;

    const validationResult = [];


    /**
     * Validates the existence and type of the question title
     */
    if (!title || typeof title !== "string") {
      validationResult.push({
        path: ".body.title",
        message: "must exist and be a string",
        errorCode: "type.openapi.validation",
      });
    }

    /**
     * Validates the existence and type of the question text
     */
    if (!text || typeof text !== "string") {
      validationResult.push({
        path: ".body.text",
        message: "must exist and be a string",
        errorCode: "type.openapi.validation",
      });
    }

    /**
     * Validates the existence and type of the tags array
     */
    if (!tags || !Array.isArray(tags)) {
      validationResult.push({
        path: ".body.tags",
        message: "must exist and be a array",
        errorCode: "type.openapi.validation",
      });
    }

    /**
     * Validates the existence and type of the user who asked the question
     */
    if (!asked_by || typeof asked_by !== "string") {
      validationResult.push({
        path: ".body.asked_by",
        message: "must exist and be a string",
        errorCode: "type.openapi.validation",
      });
    }

    /**
     * Validates the existence and type of the question timestamp
     */
    if (!ask_date_time || typeof ask_date_time !== "string") {
      validationResult.push({
        path: ".body.ask_date_time",
        message: "must exist and be a string",
        errorCode: "type.openapi.validation",
      });
    }

    /**
     * If validation fails, returns a 400 error response with validation details
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
       * Calls the service function to add the question to the database
       */
      const question = await questionService.addQuestion(req.body);
      res.json(question);
    } catch (err) {
      /**
       * Handles unexpected errors and passes them to the next middleware
       */
      console.error("Error while adding question:", err);
      next({ message: "Internal server error while adding question" });
    }
  }
);

/**
 * @route GET /question/getQuestionById/:qid
 * @description Retrieves a question by its ID and increments the view count
 * @param {Request} req - Express request object containing the question ID
 * @param {Response} res - Express response object returning the question details
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Responds with the question details or an error object
 */
router.get(
  "/getQuestionById/:qid",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.qid) {
      return next({
        status: 400,
        message: "Validation failed",
        errors: [
          {
            path: "pid",
            message: "must exist",
            errorCode: "type.openapi.validation",
          },
        ],
      });
    }

    try {
      const question = await questionService.getQuestionById(req.params.qid);
      res.json(question);
    } catch (err) {
      console.error("Error while getting question by id:", err);
      next({ message: "Internal server error while getting question by id" });
    }
  }
);

/**
 * @route GET /question/getQuestion
 * @description Retrieves a filtered list of questions based on sorting order and search keyword
 * @param {Request} req - Express request object containing query parameters for order and search
 * @param {Response} res - Express response object returning the list of filtered questions
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Responds with the list of filtered questions or an error object
 */
router.get(
  "/getQuestion",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { order = "newest", search = "" } = req.query;
      const questions = await questionService.getQuestions(
        order as string,
        search as string
      );
      res.json(questions);
    } catch (err) {
      console.error("Error while getting question:", err);
      next({ message: "Internal server error while getting question" });
    }
  }
);

export default router;
