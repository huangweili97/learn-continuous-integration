import mongoose from "mongoose";
import UserSchema from "./schema/user";
import { IUserDocument, IUserModel } from "../types/types";

/**
 * @description Defines the User model based on the UserSchema
 * 
 * The model provides an interface to interact with the User collection in MongoDB.
 * - `IUserDocument`: Represents an individual user document
 * - `IUserModel`: Represents the static methods available on the model
 */
const User = mongoose.model<IUserDocument, IUserModel>(
  "User",
  UserSchema
);

export default User; 