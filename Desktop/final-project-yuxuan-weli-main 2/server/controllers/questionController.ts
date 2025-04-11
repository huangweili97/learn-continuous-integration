/**
 * @file questionController.ts
 * @description Handles API routes related to questions under /question/*
 */
import { Router, Request, Response, NextFunction } from "express";
import questionService from "../services/questionService";
import { auth, optionalAuth } from "../middleware/auth";
import { IQuestion } from "../types/types";
import Question from "../models/questions";
import { canUserPost, updateUserPostRecord } from "../services/rateLimitService";

const router = Router();

/**
 * @route POST /question/addQuestion
 * @description Adds a new question to the database (requires authentication)
 * @param {Request} req - Express request object containing question details
 * @param {Response} res - Express response object returning the created question
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Responds with the created question or an error object
 */
router.post(
  "/addQuestion",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, text, tags } = req.body;
    const asked_by = req.user?.username;
    const ask_date_time = new Date();

    if (!asked_by) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!title || !text || !tags) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // 检查用户是否可以发帖
      const { canPost, error } = canUserPost(asked_by);
      if (!canPost) {
        return res.status(429).json({ error });
      }

      const question = await questionService.addQuestion({
        title,
        text,
        tags,
        asked_by,
        ask_date_time,
        answers: [],
        views: 0,
        upvoteCount: 0,
        downvoteCount: 0
      });

      // 更新用户发帖记录
      updateUserPostRecord(asked_by);

      res.status(201).json(question);
    } catch (err) {
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
  optionalAuth, // Optional authentication for viewing
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
  optionalAuth, // Optional authentication for viewing
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

/**
 * @route POST /question/:qid/upvote
 * @description Upvotes a question (requires authentication)
 * @param {Request} req - Express request object containing the question ID
 * @param {Response} res - Express response object returning the updated question
 * @returns {Promise<void>} Responds with the updated question or an error object
 */
export const upvoteQuestion = async (req: Request, res: Response) => {
  try {
    const question = await questionService.upvoteQuestion(req.params.qid, req.user._id);
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @route POST /question/:qid/downvote
 * @description Downvotes a question (requires authentication)
 * @param {Request} req - Express request object containing the question ID
 * @param {Response} res - Express response object returning the updated question
 * @returns {Promise<void>} Responds with the updated question or an error object
 */
export const downvoteQuestion = async (req: Request, res: Response) => {
  try {
    const question = await questionService.downvoteQuestion(req.params.qid, req.user._id);
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 注册路由
router.post("/:qid/upvote", auth, upvoteQuestion);
router.post("/:qid/downvote", auth, downvoteQuestion);

export default router;
