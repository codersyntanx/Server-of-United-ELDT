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
      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

      // Set the hashed temporary password
      this.password = temporaryPassword;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});




const studentModel = mongoose.model("student", studentSchema);



function generateTemporaryPassword() {
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let temporaryPassword = '';

  // Add one letter
  temporaryPassword += letters[Math.floor(Math.random() * letters.length)];

  // Add one number
  temporaryPassword += numbers[Math.floor(Math.random() * numbers.length)];

  // Add one symbol
  temporaryPassword += symbols[Math.floor(Math.random() * symbols.length)];

  // Add remaining characters
  const remainingLength = 12 - temporaryPassword.length;
  const allCharacters = letters + numbers + symbols;
  for (let i = 0; i < remainingLength; i++) {
    temporaryPassword += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password characters
  temporaryPassword = temporaryPassword.split('').sort(() => Math.random() - 0.5).join('');

  return temporaryPassword;
}





module.exports = studentModel;
