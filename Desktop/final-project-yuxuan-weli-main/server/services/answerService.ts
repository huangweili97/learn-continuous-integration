/**
 * @file answerService.ts
 * @description Business logic layer for handling answers, utilizing static methods from the Answer model.
 */
import Answer from "../models/answers";
import Question from "../models/questions";
import { IAnswer } from "../types/types";

/**
 * @function addAnswer
 * @description Adds a new answer to the database and associates it with the corresponding question.
 * 
 * Logic:
 * - Calls the Answer model’s static method to create a new answer.
 * - Adds the answer's `_id` to the corresponding question using the instance method `addAnswer`.
 * 
 * @param {Object} data - The request data containing the question ID and answer object.
 * @param {string} data.qid - The ID of the question to which the answer belongs.
 * @param {IAnswer} data.ans - The answer object containing text, author, and timestamp.
 * 
 * @returns {Promise<IAnswer>} The newly created answer document.
 */
const addAnswer = async (data: {
  qid: string;
  ans: IAnswer;
}): Promise<IAnswer> => {
  const { qid, ans } = data;
 
  const answer = await Answer.createAnswer({
    text: ans.text,
    ans_by: ans.ans_by,
    ans_date_time: new Date(ans.ans_date_time),
  });
  
  const question = await Question.findById(qid);
  if (question && answer._id) {
    await question.addAnswer(answer._id);
  }
  return answer;
};

export default { addAnswer };
