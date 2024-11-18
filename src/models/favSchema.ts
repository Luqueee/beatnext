// Importing mongoose library along with Document and Model types from it
import mongoose, { type Model } from "mongoose";
import type { Song } from "./playlistSchema";

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

export interface Fav {
  username: string;
  cover: string;
  songs: Song[];
}

const songSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: false, // Removed unique constraint
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  cover: {
    type: String,
    required: true,
    unique: false,
  },
  artist: {
    type: String,
    required: false,
  },
});

// Defining a mongoose schema for the todo document, specifying the types
// and constraints
const favSchema = new mongoose.Schema<Fav>(
  {
    username: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    songs: {
      type: [songSchema],
      required: false,
      default: [],
      unique: false,
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields to the document
    timestamps: true,
  }
);

// Creating a mongoose model for the todo document
const Fav: Model<Fav> =
  mongoose.models?.Fav || mongoose.model("Fav", favSchema);

export default Fav;
