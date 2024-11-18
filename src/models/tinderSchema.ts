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

export interface Tinder {
  spotifyId: string;
  soundcloudId: string;
  artist: string;
  title: string;
  cover: string;
  likes: number;
  dislikes: number;
}

// Defining a mongoose schema for the todo document, specifying the types
// and constraints
const tinderSchema = new mongoose.Schema<Tinder>(
  {
    spotifyId: {
      type: String,
      required: true,
      unique: true,
    },
    soundcloudId: {
      type: String,
      required: true,
      unique: true,
    },
    artist: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: false,
      default: 0,
    },
    dislikes: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  {
    // Automatically add 'createdAt' and 'updatedAt' fields to the document
    timestamps: true,
  }
);

// Creating a mongoose model for the todo document
const Tinder: Model<Tinder> =
  mongoose.models?.Tinder || mongoose.model("Tinder", tinderSchema);

export default Tinder;
