const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({
  courseEnrollments: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonIndex: {
      type: Number,
      default: 0,
    },
    language:{
      type:String,
      default:"English"
    },
    completed:{
      type:Boolean,
      default:false
    }
  }],
  fullName: {
    type: String,
  },
  Email: {
    type: String,
  },
  password: {
    type: String,
  },
  price: {
    type: String,
  },
  address: {
    type: String,
  },
  zip: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  licenseNumber: {
    type: String,
  },
  state: {
    type: String,
  },
});
studentSchema.pre("save", async function (next) {
  // Check if the document is new or if the password field is being modified
  if (this.isNew || this.isModified("password")) {
    try {
      // Generate a temporary password only if it's a new student or password is being modified
      const temporaryPassword = generateTemporaryPassword();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

      // Set the hashed temporary password
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});




const studentModel = mongoose.model("student", studentSchema);

// Function to generate a temporary password
// Function to generate a temporary 6-digit password
function generateTemporaryPassword() {
  let temporaryPassword = '';
  for (let i = 0; i < 6; i++) {
    temporaryPassword += Math.floor(Math.random() * 10); // Random digit from 0 to 9
  }
  return temporaryPassword;
}



module.exports = studentModel;
