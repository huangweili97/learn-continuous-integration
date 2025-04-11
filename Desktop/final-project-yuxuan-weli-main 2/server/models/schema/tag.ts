import mongoose from "mongoose";
import { ITag, ITagDocument, ITagModel } from "../../types/types";

/**
 * The schema for a document in the Tags collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: ITagDocument and ITagModel.
 * ITagDocument is used to define the instance methods of the Tag document.
 * ITagModel is used to define the static methods of the Tag model.
 */

const TagSchema = new mongoose.Schema<ITagDocument, ITagModel>(
  { name: { type: String, required: true, unique: true } },
  { collection: "Tag" }
);

/**
 * @method findOrCreateMany
 * @description Finds existing tags by name or creates new tags if they do not exist
 * @param {string[]} tagNames - An array of tag names to search for or create
 * @returns {Promise<ITag[]>} An array of tag documents
 */
TagSchema.statics.findOrCreateMany = async function (
  tagNames: string[]
): Promise<ITag[]> {
  const tags: ITag[] = [];
  for (const name of tagNames) {
    let tag = await this.findOne({ name });
    if (!tag) {
      tag = await this.create({ name });
    }

    tags.push(tag);
  }
  return tags;
};

export default TagSchema;
