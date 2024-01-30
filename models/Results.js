const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  indexnumber: {
    type: Number,
    required: true,
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.chapters',
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const ResultModel = mongoose.model("Result", resultSchema);

module.exports = ResultModel;
