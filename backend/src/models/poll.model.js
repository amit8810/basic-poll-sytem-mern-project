import mongoose, { Schema } from "mongoose";

const optionsSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
});

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  option: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const pollSchema = new mongoose.Schema(
  {
    institute: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    targetRoles: {
      type: String,
      enum: ["student", "teacher", "both"],
      required: true,
    },
    options: [optionsSchema],
    votes: [voteSchema]
  },
  { timestamps: true }
);

export const Poll = mongoose.model("Poll", pollSchema);
