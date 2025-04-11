/**
 * @file answerService.ts
 * @description Business logic layer for handling answers, utilizing static methods from the Answer model.
 */
import Answer from "../models/answers";
import Question from "../models/questions";
import { IAnswer } from "../types/types";
import User from "../models/users";

/**
 * @function addAnswer
 * @description Adds a new answer to the database and associates it with the corresponding question.
 * 
 * Logic:
 * - Calls the Answer model's static method to create a new answer.
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
    upvoteCount: 0,
    downvoteCount: 0
  });
  
  const question = await Question.findById(qid);
  if (question && answer._id) {
    await question.addAnswer(answer._id);
  }
  return answer;
};

/**
 * @function upvoteAnswer
 * @description 增加回答的点赞数，并记录用户投票
 * @param {string} aid - 回答的ID
 * @param {string} userId - 用户的ID
 * @returns {Promise<IAnswer | null>} 更新后的回答文档
 */
const upvoteAnswer = async (aid: string, userId: string): Promise<IAnswer | null> => {
  const answer = await Answer.findById(aid);
  const user = await User.findById(userId);
  
  if (!answer || !user) {
    return null;
  }

  // 检查用户是否已经投票
  const existingVote = user.votedAnswers.find(vote => vote.answerId.toString() === aid);
  
  if (existingVote) {
    if (existingVote.voteType === 'upvote') {
      // 如果已经点赞，则取消点赞
      await answer.decrementUpvote();
      user.votedAnswers = user.votedAnswers.filter(vote => vote.answerId.toString() !== aid);
    }
    // 如果已经点踩，则不做任何操作
  } else {
    // 如果没有投票记录，则添加点赞
    await answer.incrementUpvote();
    user.votedAnswers.push({
      answerId: answer._id,
      voteType: 'upvote'
    });
  }

  await user.save();
  return answer;
};

/**
 * @function downvoteAnswer
 * @description 增加回答的点踩数，并记录用户投票
 * @param {string} aid - 回答的ID
 * @param {string} userId - 用户的ID
 * @returns {Promise<IAnswer | null>} 更新后的回答文档
 */
const downvoteAnswer = async (aid: string, userId: string): Promise<IAnswer | null> => {
  const answer = await Answer.findById(aid);
  const user = await User.findById(userId);
  
  if (!answer || !user) {
    return null;
  }

  // 检查用户是否已经投票
  const existingVote = user.votedAnswers.find(vote => vote.answerId.toString() === aid);
  
  if (existingVote) {
    if (existingVote.voteType === 'downvote') {
      // 如果已经点踩，则取消点踩
      await answer.decrementDownvote();
      user.votedAnswers = user.votedAnswers.filter(vote => vote.answerId.toString() !== aid);
    }
    // 如果已经点赞，则不做任何操作
  } else {
    // 如果没有投票记录，则添加点踩
    await answer.incrementDownvote();
    user.votedAnswers.push({
      answerId: answer._id,
      voteType: 'downvote'
    });
  }

  await user.save();
  return answer;
};

export default { addAnswer, upvoteAnswer, downvoteAnswer };
