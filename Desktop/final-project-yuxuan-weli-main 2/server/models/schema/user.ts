import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserDocument, IUserModel } from "../../types/types";

/**
 * The schema for a document in the User collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IUserDocument and IUserModel.
 * IUserDocument is used to define the instance methods of the User document.
 * IUserModel is used to define the static methods of the User model.
 */
const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Don't include password in query results by default
    },
    // 添加投票记录
    votedQuestions: [{
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      voteType: { type: String, enum: ['upvote', 'downvote'] }
    }],
    votedAnswers: [{
      answerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' },
      voteType: { type: String, enum: ['upvote', 'downvote'] }
    }]
  },
  { 
    collection: "User",
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
);

/**
 * @method comparePassword
 * @description Compares a candidate password with the stored hashed password
 * @param {string} candidatePassword - The password to compare
 * @returns {Promise<boolean>} True if the passwords match, false otherwise
 */
UserSchema.methods.comparePassword = function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * @method generateAuthToken
 * @description Generates a JWT token for user authentication
 * @returns {Promise<string>} The generated JWT token
 */
UserSchema.methods.generateAuthToken = async function(): Promise<string> {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  return token;
};

/**
 * @method createUser
 * @description Creates a new user with a hashed password
 * @param {Object} data - The user data to be stored
 * @param {string} data.username - The username
 * @param {string} data.email - The email address
 * @param {string} data.password - The plain text password
 * @returns {Promise<IUserDocument>} The newly created user document
 */
UserSchema.statics.createUser = async function(data: {
  username: string;
  email: string;
  password: string;
}): Promise<IUserDocument> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  
  const user = new this({
    ...data,
    password: hashedPassword
  });
  
  return user.save();
};

/**
 * @method findByEmail
 * @description Finds a user by email address
 * @param {string} email - The email address to search for
 * @returns {Promise<IUserDocument | null>} The user document or null if not found
 */
UserSchema.statics.findByEmail = async function(email: string): Promise<IUserDocument | null> {
  return this.findOne({ email }).select('+password');
};

/**
 * @method findByUsername
 * @description Finds a user by username
 * @param {string} username - The username to search for
 * @returns {Promise<IUserDocument | null>} The user document or null if not found
 */
UserSchema.statics.findByUsername = async function(username: string): Promise<IUserDocument | null> {
  return this.findOne({ username });
};

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Skip if password is not modified or if it's already hashed
  if (!this.isModified('password') || this.password.startsWith('$2')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export default UserSchema; 