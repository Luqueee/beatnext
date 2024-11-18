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

export interface SongRelationType {
  spotifyId: string;
  soundcloudId: number;
  title: string;
  cover: string;
  artists: string;
  duration: number;
  popularity: number;
}

// Defining a mongoose schema for the todo document, specifying the types
// and constraints
const songRelationSchema = new mongoose.Schema<SongRelationType>(
  {
    spotifyId: {
      type: String,
      required: true,
      unique: true,
    },
    soundcloudId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    artists: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    popularity: {
      type: Number,
      required: true,
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields to the document
    timestamps: true,
  }
);

// Creating a mongoose model for the todo document
const SongRelation: Model<SongRelationType> =
  mongoose.models?.SongRelation ||
  mongoose.model("SongRelation", songRelationSchema);

export default SongRelation;
