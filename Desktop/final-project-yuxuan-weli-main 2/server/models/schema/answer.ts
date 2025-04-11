import mongoose from "mongoose";
import { IAnswer, IAnswerDocument, IAnswerModel } from "../../types/types";

/**
 * The schema for a document in the Answer collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IAnswerDocument and IAnswerModel.
 * IAnswerDocument is used to define the instance methods of the Answer document.
 * IAnswerModel is used to define the static methods of the Answer model.
 */
const AnswerSchema = new mongoose.Schema<IAnswerDocument, IAnswerModel>(
  {
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_date_time: { type: Date, required: true },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
  },
  { collection: "Answer" }
);

/**
 * @method createAnswer
 * @description Creates and saves a new answer in the database
 * @param {IAnswer} data - The answer data to be stored
 * @returns {Promise<IAnswerDocument>} The newly created answer document
 */
AnswerSchema.statics.createAnswer = async function (
  data: IAnswer
): Promise<IAnswerDocument> {
  const answer = new this(data);
  return answer.save();
};

/**
 * @method incrementUpvote
 * @description Increments the upvote count of an answer
 * @returns {Promise<IAnswerDocument>} The updated answer document
 */
AnswerSchema.methods.incrementUpvote =
  async function (): Promise<IAnswerDocument> {
    this.upvoteCount += 1;
    return this.save();
  };

/**
 * @method decrementUpvote
 * @description Decrements the upvote count of an answer
 * @returns {Promise<IAnswerDocument>} The updated answer document
 */
AnswerSchema.methods.decrementUpvote =
  async function (): Promise<IAnswerDocument> {
    this.upvoteCount = Math.max(0, this.upvoteCount - 1);
    return this.save();
  };

/**
 * @method incrementDownvote
 * @description Increments the downvote count of an answer
 * @returns {Promise<IAnswerDocument>} The updated answer document
 */
AnswerSchema.methods.incrementDownvote =
  async function (): Promise<IAnswerDocument> {
    this.downvoteCount += 1;
    return this.save();
  };

/**
 * @method decrementDownvote
 * @description Decrements the downvote count of an answer
 * @returns {Promise<IAnswerDocument>} The updated answer document
 */
AnswerSchema.methods.decrementDownvote =
  async function (): Promise<IAnswerDocument> {
    this.downvoteCount = Math.max(0, this.downvoteCount - 1);
    return this.save();
  };

export default AnswerSchema;
