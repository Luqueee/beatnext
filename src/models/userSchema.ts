// Importing mongoose library along with Document and Model types from it
import mongoose, { type Model } from "mongoose";

// Defining the structure of a todo item using TypeScript interfaces
// export interface ITodo {
//   todo: string;
//   todoDeadline: number;
// }

// Merging ITodo interface with mongoose's Document interface to create
// a new interface that represents a todo document in MongoDB
// export interface ITodoDocument extends ITodo, Document {
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface User {
  username: string;
  email: string;
  image: string;
}

// Defining a mongoose schema for the todo document, specifying the types
// and constraints
const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields to the document
    timestamps: true,
  }
);

// Creating a mongoose model for the todo document
const User: Model<User> =
  mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
