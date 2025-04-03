/**
 * @file tagController.ts
 * @description Handles API routes related to tags under /tag/*
 */
import { Router, Request, Response, NextFunction } from "express";
import tagService from "../services/tagService";

const router = Router();

/**
 * @route GET /tag/getTagsWithQuestionNumber
 * @description Retrieves all tags along with the number of questions associated with each tag
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object returning the list of tags with question counts
 * @param {NextFunction} next - Express next function for error handling
 * @returns {Promise<void>} Responds with the list of tags and their associated question counts or an error object
 */
router.get(
  "/getTagsWithQuestionNumber",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await tagService.getTagsWithQuestionNumber();
      res.json(tags);
    } catch (err) {
      console.error("Error while getting tags with question number:", err);
      next({
        message:
          "Internal server error while getting tags with question number",
      });
    }
  }
);

export default router;
