/**
 * @file questionService.ts
 * @description Business logic layer for handling questions, utilizing static methods from the Question model.
 */
import Question from "../models/questions";
import Tag from "../models/tags";
import { IQuestion, ITag } from "../types/types";

/**
 * @function addQuestion
 * @description Adds a new question to the database after processing tags.
 * 
 * Logic:
 * - Extracts tag names from the request and finds or creates them in the Tag model.
 * - Constructs the question data and adds it to the database using the Question model.
 * 
 * @param {IQuestion} data - The request data containing question details.
 * @param {string} data.title - The title of the question.
 * @param {string} data.text - The content of the question.
 * @param {ITag[]} data.tags - The associated tags.
 * @param {string} data.asked_by - The user who asked the question.
 * @param {Date} data.ask_date_time - The timestamp of the question.
 * 
 * @returns {Promise<IQuestion>} The newly created question document.
 */
const addQuestion = async (data: IQuestion): Promise<IQuestion> => {
  const { title, text, tags, asked_by, ask_date_time } = data;
  
  const tagNames = tags.map((t: ITag) => t.name);
  const tagDocs = await Tag.findOrCreateMany(tagNames);

  const questionData = {
    title,
    text,
    asked_by,
    ask_date_time: new Date(ask_date_time),
    tags: tagDocs,
    views: 0,
  };

  
  const question = await Question.addNewQuestion(questionData);
  return question;
};

/**
 * @function getQuestionById
 * @description Retrieves a question by its ID and increments its view count.
 * 
 * @param {string} qid - The ID of the question to retrieve.
 * 
 * @returns {Promise<IQuestion | null>} The question document or null if not found.
 */
const getQuestionById = async (qid: string): Promise<IQuestion | null> => {
  return Question.findByIdAndIncrementViews(qid);
};

/**
 * @function getQuestionsByOrder
 * @description Retrieves questions sorted based on the provided order type.
 * 
 * - `"active"`: Returns questions sorted by recent activity.
 * - `"unanswered"`: Returns questions that have no answers.
 * - `"newest"`: Returns the most recently asked questions.
 * - Default: Returns newest questions.
 * 
 * @param {string} order - The sorting order for retrieving questions.
 * 
 * @returns {Promise<IQuestion[]>} A list of sorted questions.
 */
const getQuestionsByOrder = async (order: string): Promise<IQuestion[]> => {
  switch (order) {
    case "active":
      return Question.getActiveQuestions();
    case "unanswered":
      return Question.getUnansweredQuestions();
    case "newest":
      return Question.getNewestQuestions();
    default:
      return Question.getNewestQuestions();
  }
};

/**
 * @function getQuestions
 * @description Retrieves questions based on order and search criteria.
 * 
 * - Filters questions by search keywords and tags if provided.
 * - Keywords are extracted from the search string.
 * - Tags are extracted from words wrapped in brackets `[]`.
 * 
 * @param {string} order - The sorting order for retrieving questions.
 * @param {string} search - The search string containing keywords and tags.
 * 
 * @returns {Promise<IQuestion[]>} A filtered list of questions.
 */
const getQuestions = async (
  order: string,
  search: string
): Promise<IQuestion[]> => {
  
  const orderList = await getQuestionsByOrder(order);

  if (search) {
   
    const searchTags = (search.match(/\[([^\]]+)\]/g) || []).map((word) =>
      word.slice(1, -1)
    );
    
    const searchKeywordList =
      search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];

    return orderList.filter((question: IQuestion) => {
      if (searchKeywordList.length === 0 && searchTags.length === 0) {
        return true;
      }

      if (searchKeywordList.length) {
        for (const keyword of searchKeywordList) {
          if (
            question.title.includes(keyword) ||
            question.text.includes(keyword)
          ) {
            return true;
          }
        }
      }

      if (searchTags.length) {
        const qTagNameList = question.tags.map((t) => t.name);
        for (const tag of searchTags) {
          if (qTagNameList.includes(tag)) {
            return true;
          }
        }
      }

      return false;
    });
  }

  return orderList;
};

export default { addQuestion, getQuestionById, getQuestions };
