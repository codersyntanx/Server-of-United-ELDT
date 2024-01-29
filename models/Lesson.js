const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.chapters',
    required: true,
  },
  questions: [{
    questionText: {
      type: String,
      required: true,
    },
    options: [{
      optionText: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    }],
  }],
});

const QuestionModel = mongoose.model("Question", questionSchema);

module.exports = QuestionModel;
