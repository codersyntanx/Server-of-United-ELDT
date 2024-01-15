const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  lessonTitle: {
    type: String,
    required: true,
  },
  pages: [
    {
      description: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
});

const lessonModel = mongoose.model("Lesson", lessonSchema);

module.exports = lessonModel;