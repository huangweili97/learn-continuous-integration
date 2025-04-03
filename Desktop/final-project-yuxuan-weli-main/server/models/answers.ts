import mongoose from "mongoose";
import { IAnswerModel, IAnswerDocument } from "../types/types";
import AnswerSchema from "./schema/answer";

/**
 * @description Defines the Answer model based on the AnswerSchema
 * 
 * The model provides an interface to interact with the Answer collection in MongoDB.
 * - `IAnswerDocument`: Represents an individual answer document
 * - `IAnswerModel`: Represents the static methods available on the model
 */
const Answer = mongoose.model<IAnswerDocument, IAnswerModel>(
  "Answer",
  AnswerSchema
);

export default Answer;
