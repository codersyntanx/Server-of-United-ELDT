const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
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
  Lastupdate: {
    type: String,
    required: true,
  },
  lessons: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    }],
    default: [],
  },

});

const Plans = mongoose.model("Plans", planSchema);

module.exports = Plans;
