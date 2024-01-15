const mongoose = require("mongoose");

const mainplanSchema = new mongoose.Schema({
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
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
  ],
});

const mainplan = mongoose.model("ELDTPlans", mainplanSchema);

module.exports = mainplan;
