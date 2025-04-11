/**
 * This module defines the functions to interact with the REST APIs for the questions service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { QuestionType, QuestionResponseType } from "../types/entityTypes";

// The base URL for the questions API
const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

/**
 * The function calls the API to get questions based on the filter parameters.
 * returns the response data if the status is 200, otherwise throws an error.
 * @param order display order of the questions selected by the user. @default "newest"
 * @param search the search query entered by the user. @default ""
 * @returns the response data from the API, which contains the matched list of questions.
 */
export const getQuestionsByFilter = async (
  order = "newest",
  search = ""
): Promise<QuestionResponseType[]> => {
  try {
    const res = await api.get(
      `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );
    if (res.status !== 200) {
      throw new Error("Error when fetching or filtering questions");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

/**
 * The function calls the API to get a question by its id,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param qid the id of the question to be fetched.
 * @returns the response data from the API, which contains the fetched question object.
 */
export const getQuestionById = async (qid: string): Promise<QuestionResponseType> => {
  try {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
    if (res.status !== 200) {
      throw new Error("Error when fetching question by id");
    }
    return res.data;
  } catch (error) {
    console.error(`Error fetching question ${qid}:`, error);
    throw error;
  }
};

/**
 * The function calls the API to add a new question,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param q the question object to be added.
 * @returns the response data from the API, which contains the question object added.
 */
export const addQuestion = async (question: Omit<QuestionType, "_id">): Promise<QuestionResponseType> => {
  try {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, question);
    
    // 检查响应状态码
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    
    // 处理各种错误情况
    if (res.status === 429) {
      throw new Error(res.data.error || "You are posting too frequently. Please wait before posting again.");
    }
    
    if (res.status === 401) {
      throw new Error("You must be logged in to post a question");
    }
    
    if (res.status === 400) {
      throw new Error(res.data.error || "Invalid question data");
    }
    
    // 如果状态码不是200或201，抛出错误
    throw new Error("Error when adding question");
  } catch (error: any) {
    // 处理网络错误或服务器错误
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    if (error.response?.status === 429) {
      throw new Error("You are posting too frequently. Please wait before posting again.");
    }
    if (error.response?.status === 401) {
      throw new Error("You must be logged in to post a question");
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || "Invalid question data");
    }
    console.error("Error adding question:", error);
    throw error;
  }
};
