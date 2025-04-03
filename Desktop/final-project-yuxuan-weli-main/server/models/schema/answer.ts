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

export default AnswerSchema;
