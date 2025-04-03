import mongoose from "mongoose";
import QuestionSchema from "./schema/question";
import { IQuestionDocument, IQuestionModel } from "../types/types";

/**
 * @description Defines the Question model based on the QuestionSchema
 * 
 * The model provides an interface to interact with the Question collection in MongoDB.
 * - `IQuestionDocument`: Represents an individual question document
 * - `IQuestionModel`: Represents the static methods available on the model
 */
const Question = mongoose.model<IQuestionDocument, IQuestionModel>(
  "Question",
  QuestionSchema
);

export default Question;
