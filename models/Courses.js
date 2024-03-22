const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const chapterSchema = new mongoose.Schema({
  lessonTitle: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  pages: [pageSchema],
});

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  thumnail:{
    type: String,
  },
  videourl:{
    type: String,
  },
  chapters: [chapterSchema],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
