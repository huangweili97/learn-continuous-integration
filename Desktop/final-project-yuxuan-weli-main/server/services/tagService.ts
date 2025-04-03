/**
 * @file tagService.ts
 * @description Business logic layer for handling tags, utilizing static methods from the Tag model.
 */
import Question from "../models/questions";
import Tag from "../models/tags";
import { ITag } from "../types/types";

/**
 * @function getTagsWithQuestionNumber
 * @description Retrieves all tags along with the number of questions associated with each tag.
 * 
 * - Calls the `getTagsWithQuestionCount` method from the Question model.
 * - Returns an array of tag objects with question count statistics.
 * 
 * @returns {Promise<Array<{ name: string; qcnt: number }>>} An array containing tag names and their associated question count.
 */
const getTagsWithQuestionNumber = async (): Promise<
  Array<{ name: string; qcnt: number }>
> => {
 
  const result = await Question.getTagsWithQuestionCount();
  return result;
};

/**
 * @function findOrCreateTags
 * @description Finds existing tags by name or creates new ones if they do not exist.
 * 
 * - Calls the `findOrCreateMany` method from the Tag model.
 * - Returns an array of tag documents.
 * 
 * @param {string[]} tagNames - An array of tag names to search for or create.
 * 
 * @returns {Promise<ITag[]>} An array of tag documents.
 */
const findOrCreateTags = async (tagNames: string[]): Promise<ITag[]> => {
  const tags = await Tag.findOrCreateMany(tagNames);
  return tags;
};

export default { getTagsWithQuestionNumber, findOrCreateTags };
