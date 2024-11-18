import mongoose, { type Model, Schema } from "mongoose";

export interface Playlist {
  _id?: string;
  username: string;
  title: string;
  cover?: string;
  description?: string;
  visible?: boolean;
  songs: Song[];
}

export interface Song {
  id: number;
  title: string;
  cover: string;
  artist: string;
}

const songSchema = new Schema({
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

const playlistSchema = new Schema<Playlist>(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    visible: {
      type: Boolean,
      required: false,
      default: true,
    },
    title: {
      type: String,
      required: true,
      unique: false,
    },
    cover: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    songs: {
      type: [songSchema],
      default: [],
      required: false,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

const Playlist: Model<Playlist> =
  mongoose.models?.Playlist || mongoose.model("Playlist", playlistSchema);

export default Playlist;
