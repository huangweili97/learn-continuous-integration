import mongoose from "mongoose";
import TagSchema from "./schema/tag";
import { ITagDocument, ITagModel } from "../types/types";

/**
 * @description Defines the Tag model based on the TagSchema
 * 
 * The model provides an interface to interact with the Tag collection in MongoDB.
 * - `ITagDocument`: Represents an individual tag document
 * - `ITagModel`: Represents the static methods available on the model
 */
export const Tag = mongoose.model<ITagDocument, ITagModel>("Tag", TagSchema);

export default Tag;
