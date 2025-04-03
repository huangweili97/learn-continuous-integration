import mongoose from "mongoose";
import { IQuestionDocument, IQuestionModel } from "../../types/types";

/**
 * The schema for a document in the Question collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IQuestionDocument and IQuestionModel.
 * IQQuestionDocument is used to define the instance methods of the Question document.
 * IQuestionModel is used to define the static methods of the Question model.
 */
const QuestionSchema = new mongoose.Schema<IQuestionDocument, IQuestionModel>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    asked_by: { type: String, required: true },
    ask_date_time: { type: Date, required: true },
    views: { type: Number, default: 0 },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  },
  { collection: "Question" }
);

/**
 * @method addNewQuestion
 * @description Adds a new question to the database
 * @param {Object} data - The question data to be stored
 * @param {string} data.title - The title of the question
 * @param {string} data.text - The content of the question
 * @param {string} data.asked_by - The user who asked the question
 * @param {Date} data.ask_date_time - The timestamp of the question
 * @param {mongoose.Types.ObjectId[]} data.tags - The associated tags
 * @returns {Promise<IQuestionDocument>} The newly created question document
 */
QuestionSchema.statics.addNewQuestion = async function (data: {
  title: string;
  text: string;
  asked_by: string;
  ask_date_time: Date;
  tags: mongoose.Types.ObjectId[];
}): Promise<IQuestionDocument> {
  const question = new this(data);
  return question.save();
};

/**
 * @method findByIdAndIncrementViews
 * @description Finds a question by its ID and increments the view count
 * @param {string} id - The ID of the question
 * @returns {Promise<IQuestionDocument | null>} The updated question document or null if not found
 */
QuestionSchema.statics.findByIdAndIncrementViews = async function (
  id: string
): Promise<IQuestionDocument | null> {
  const question = await this.findById(id).populate("tags").populate("answers");

  if (question) {
    await question.incrementViews();

    // 反转答案数组的顺序
    if (Array.isArray(question.answers)) {
      question.answers.reverse();
    }
  }
  return question;
};

/**
 * @method getNewestQuestions
 * @description Retrieves a list of the newest questions sorted by ask_date_time in descending order
 * @returns {Promise<IQuestionDocument[]>} The array of newest questions
 */
QuestionSchema.statics.getNewestQuestions = async function (): Promise<
  IQuestionDocument[]
> {
  return this.find({})
    .sort({ ask_date_time: -1 })
    .populate("tags")
    .populate("answers");
};

/**
 * @method getUnansweredQuestions
 * @description Retrieves a list of unanswered questions sorted by ask_date_time in descending order
 * @returns {Promise<IQuestionDocument[]>} The array of unanswered questions
 */
QuestionSchema.statics.getUnansweredQuestions = async function (): Promise<
  IQuestionDocument[]
> {
  return this.find({ answers: { $size: 0 } })
    .sort({ ask_date_time: -1 })
    .populate("tags")
    .populate("answers");
};

/**
 * @method getActiveQuestions
 * @description Retrieves a list of active questions sorted by most recent activity, 
 * which is either the latest answer date or the question's ask date if there are no answers
 * @returns {Promise<IQuestionDocument[]>} The array of active questions
 */
QuestionSchema.statics.getActiveQuestions = async function (): Promise<
  IQuestionDocument[]
> {
  const questions = await this.aggregate([
    
    {
      $lookup: {
        from: "Answer",
        localField: "answers",
        foreignField: "_id",
        as: "answersDetail",
      },
    },
    
    {
      $lookup: {
        from: "Tag",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    },
   
    {
      $addFields: {
        mostRecentActivity: {
          $cond: [
            { $gt: [{ $size: "$answersDetail" }, 0] },
            { $max: "$answersDetail.ans_date_time" },
            "$ask_date_time",
          ],
        },
        
        answers: "$answersDetail",
      },
    },
   
    {
      $project: { answersDetail: 0 },
    },
    
    {
      $sort: { mostRecentActivity: -1 },
    },
  ]);
  return questions;
};

/**
 * @method incrementViews
 * @description Increments the view count of a question
 * @returns {Promise<IQuestionDocument>} The updated question document
 */
QuestionSchema.methods.incrementViews =
  async function (): Promise<IQuestionDocument> {
    this.views += 1;
    return this.save();
  };

/**
 * @method addAnswer
 * @description Adds an answer to the question's answers array
 * @param {mongoose.Types.ObjectId} answerId - The ObjectId of the answer to be added
 * @returns {Promise<IQuestionDocument>} The updated question document
 */
QuestionSchema.methods.addAnswer = async function (
  answerId: mongoose.Types.ObjectId
): Promise<IQuestionDocument> {
  this.answers.push(answerId);
  return this.save();
};

/**
 * @method getTagsWithQuestionCount
 * @description Retrieves a count of questions associated with each tag
 * @returns {Promise<Array<{ name: string; qcnt: number }>>} An array of objects containing tag names and their question count
 */
QuestionSchema.statics.getTagsWithQuestionCount = async function (): Promise<
  Array<{ name: string; qcnt: number }>
> {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "Tag", 
        localField: "_id",
        foreignField: "_id",
        as: "tagInfo",
      },
    },
    { $unwind: "$tagInfo" },
    { $project: { name: "$tagInfo.name", qcnt: "$count" } },
  ]);
};

export default QuestionSchema;
