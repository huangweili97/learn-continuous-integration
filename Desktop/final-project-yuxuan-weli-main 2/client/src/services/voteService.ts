import { REACT_APP_API_URL, api } from "./config";

/**
 * 点赞问题
 * @param qid 问题ID
 * @returns 更新后的问题数据
 */
export const upvoteQuestion = async (qid: string) => {
  try {
    const res = await api.post(`${REACT_APP_API_URL}/question/${qid}/upvote`);
    return res.data;
  } catch (error) {
    console.error("Error upvoting question:", error);
    throw error;
  }
};

/**
 * 点踩问题
 * @param qid 问题ID
 * @returns 更新后的问题数据
 */
export const downvoteQuestion = async (qid: string) => {
  try {
    const res = await api.post(`${REACT_APP_API_URL}/question/${qid}/downvote`);
    return res.data;
  } catch (error) {
    console.error("Error downvoting question:", error);
    throw error;
  }
};

/**
 * 点赞回答
 * @param aid 回答ID
 * @returns 更新后的回答数据
 */
export const upvoteAnswer = async (aid: string) => {
  try {
    const res = await api.post(`${REACT_APP_API_URL}/answer/${aid}/upvote`);
    return res.data;
  } catch (error) {
    console.error("Error upvoting answer:", error);
    throw error;
  }
};

/**
 * 点踩回答
 * @param aid 回答ID
 * @returns 更新后的回答数据
 */
export const downvoteAnswer = async (aid: string) => {
  try {
    const res = await api.post(`${REACT_APP_API_URL}/answer/${aid}/downvote`);
    return res.data;
  } catch (error) {
    console.error("Error downvoting answer:", error);
    throw error;
  }
}; 