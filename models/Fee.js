const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  payment: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Feemodal = mongoose.model("Fee", feeSchema);

module.exports = Feemodal;
