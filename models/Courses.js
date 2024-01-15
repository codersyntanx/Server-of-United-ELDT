const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

const chapterSchema = new mongoose.Schema({
  pages: [pageSchema],
});

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  category:{
    type: String,
    required: true,
  },
  price:{
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
  chapters: [chapterSchema],
},{timestamps:true});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
