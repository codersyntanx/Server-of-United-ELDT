const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PlanModel = require("../models/plan")
const mainPlanModel = require("../models/unitedeldt")
const studentModel = require("../models/plan copy")
const { sendloginpassword } = require("./Loginpass");
const {Contactusemail}= require("../Contactusemail")
const multer = require("multer"); // Add multer
const upload = multer();
 const stripe = require('stripe')('sk_test_51O5F9gFZtgAr5eHPmu3BtPDmmuRPWUmVoitQHFCugNPa1fQVqpOdgefaYVrEfHOVC0Jipu6byrfYmARCWjqyjpy400hyORLjgo');
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const paymentModel = require("../models/Payment")
const jwt = require('jsonwebtoken');
const secretkey = '2783flksjda0/.-=--982jna,769384;'
const fs = require('fs');
const path = require('path');
const courseData = require('../Classa');
const Lesson = require('../models/Lesson');
const Course = require('../models/Courses');
const {Newpaper} = require("../Newspaper")
const { sendpassword } = require("../resetpass")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// ...
app.post('/addCourseWithLessons', async (req, res) => {
  try {
    // Extract course data from the request body
    const { courseName, category, price, image, lessons } = req.body;

    // Validate incoming data
    if (!courseName || !category || !price || !image) {
      return res.status(400).json({ error: 'Invalid data. Please provide all required fields.' });
    }

    // Create an array to store lesson documents
    const lessonDocuments = [];

    // Iterate through the provided lessons and create Lesson documents
    for (const lessonData of lessons) {
      const newLesson = new Lesson({
        language: lessonData.language,
        lessonTitle: lessonData.lessonTitle,
        pages: lessonData.pages,
      });

      // Save the lesson and push its ID to the array
      const savedLesson = await newLesson.save();
      lessonDocuments.push(savedLesson._id);
    }

    // Create a new mainplan document with the provided data and the array of lesson IDs
    const newCourse = new mainPlanModel({
      courseName,
      category,
      price,
      image,
      lessons: lessonDocuments,
    });

    // Save the new course document
    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error adding course with lessons:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addLesson/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const { language, lessonTitle, pages } = req.body;

  try {
    // Check if the course exists
    const course = await mainPlanModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Validate incoming data
    if (!language || !lessonTitle || !pages) {
      return res.status(400).json({ error: 'Invalid data. Please provide language, lessonTitle, and pages.' });
    }

    // Create a new lesson
    const newLesson = new Lesson({
      language,
      lessonTitle,
      pages,
    });

    // Save the lesson
    const savedLesson = await newLesson.save();

    // Add the lesson to the course
    course.lessons.push(savedLesson);
    await course.save();

    res.status(201).json(savedLesson);
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Create Course
app.post('/create', async (req, res) => {
  try {
    const { courseName, category, price, image, chapters } = req.body;

    if (!courseName || !category || !price || !image ) {
      return res.status(400).json({ error: 'Invalid data. Please provide all required fields.' });
    }

    const newCourse = new Course({
      courseName,
      category,
      price,
      image,
      chapters,
    });

    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add Chapter to Course
app.put('/addChapter/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { chapter } = req.body;

    if (!chapter) {
      return res.status(400).json({ error: 'Invalid data. Please provide chapter details.' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { chapters: chapter },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error adding chapter to course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put("/api/putstudent/:id", async (req, res) => {
  const infotmationid = req.params.id;
  try {
      const updateinfo = await studentModel.findByIdAndUpdate(infotmationid, req.body, { new: true });

   

      res.send({
          status: true,
          updated: updateinfo
      });
  } catch (error) {
      console.error('Error updating Student:', error);
      res.status(500).send({
          status: false,
          error: 'Internal Server Error'
      });
  }
});
app.get('/courses', (req, res) => {
  res.json(courseData);
});

app.post("/postpayment", async (req, res) => {
  console.log(req.body)
  try {
    const paymentinfo = await paymentModel.create(req.body);
    res.send({
      status: true,
      created: paymentinfo
    });
  } catch (error) {
    console.error('Error creating information:', error);
    res.status(500).send({
      status: false,
      error: 'Internal Server Error'
    });
  }
});
const  {sendRoleUpdateNotification}  = require("./sendRoleUpdateNotification");

const {sendpdf} = require("./sendpdf")
app.get("/api/plans", async (req, res) => {
  try {
    const allplans = await PlanModel.find();
    res.status(200).json(allplans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/mainplans", async (req, res) => {
  try {
    const allplans = await mainPlanModel.find();
    res.status(200).json(allplans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/plansed/:id", async (req, res) => {
  try {
    const plan = await PlanModel.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching plan by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/create-payment-intents", async (req, res) => {
  try {
    // Check if a user with the given email already exists
    const existingStudent = await studentModel.findOne({ Email: req.body.Email });

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
    });

    if (existingStudent) {
      // If the user already exists, add the new courseId to the array
      existingStudent.courseIds.push(req.body.courseId);
      await existingStudent.save();

      // Perform other actions if needed

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: 'User found and updated with new courseId',
      });
    } else {
      // If the user doesn't exist, create a new one
      const student = await studentModel.create({
        ...req.body,
        courseIds: [req.body.courseId], // Initialize the array with the first courseId
      });

      const generatedPassword = student.password;
      const Emailof = student.Email;
      await sendloginpassword(Emailof, generatedPassword);

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: 'User created with courseId',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

app.post("/api/sendemail", async (req, res) => {
  const { Name, Email, Phone, Message } = req.body;

  try {
    await sendRoleUpdateNotification( Name, Email, Phone, Message );
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post("/api/sennews", async (req, res) => {
  const {  Email } = req.body;

  try {
    await Newpaper( Email );
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/api/login", async (request, response) => {
  console.log(request.body);

  try {
    const { Email, password } = request.body;
    const person = await studentModel.findOne({ Email: Email });

    if (!person) {
      return response.json({
        status: "false",
        msg: "This email is not registered",
      });
    }

    console.log(person);

    // Use === for comparison
    if (password === person.password) {
      const token = jwt.sign(
        {  Email: person.Email, id: person._id },
        secretkey
      );
      return response.json({
        status: "true",
        token: token,
      });
    } else {
      return response.json({
        status: "false",
        msg: "Email or password is incorrect",
      });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};

      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return response.json({
        status: false,
        errors: errors,
      });
    } else {
      console.error(error);
      return response.status(500).json({
        status: false,
        msg: "Internal Server Error",
      });
    }
  }
});
app.get("/studentbyid/:id", async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ status: false, error: "Student not found" });
    }
    res.status(200).json({ status: true, student });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

// Assuming you have a field 'email' in your student schema
app.get("/studentbyemail/:email", async (req, res) => {
  try {
    const student = await studentModel.findOne({ Email: req.params.email });
    if (!student) {
      return res.json({ status: false, error: "Student not found" });
    }
    
    // Send password asynchronously
    await sendpassword(student.Email, student.password);

    res.status(200).json({ status: true, student });
  } catch (error) {
    console.error("Error fetching student by email:", error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});



const crypto = require('crypto');

app.post("/api/sendforgetpassword", async (req, res) => {
  try {
    const existingStudent = await studentModel.findOne({ Email: req.body.Email });

    if (existingStudent) {
      // Generate a unique token for password reset
      const resetToken = crypto.randomBytes(20).toString('hex');
      existingStudent.resetPasswordToken = resetToken;
      existingStudent.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

      // Save the token and expiration date in the database
      await existingStudent.save();

      // Send an email to the user with a link to reset the password
      sendPasswordResetEmail(existingStudent.Email, resetToken);

      res.status(200).json({ message: 'Email sent successfully' });
    } else {
      // Email not found
      res.status(404).json({ error: 'Email not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getDocxContent', (req, res) => {
  // Replace 'path/to/your/google-doc.txt' with the actual path to your Google Doc file
  const filePath = path.join(__dirname, './lesson 1 new-ORIENTATION.docx');
  fs.readFile(filePath, (err, binaryContent) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading .docx file');
      return;
    }

    // Send the binary content to the React frontend
    res.send(binaryContent);
  });
});

app.post("/api/contactusemail", async (req, res) => {
  const { name, email, phone, message,subject } = req.body;

  try {
    await Contactusemail(name, email, phone, message,subject);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post("/api/sendpdfs", upload.single("pdf"), async (req, res) => {
  const { Email } = req.body;
  const pdf = req.file; // Access the uploaded file from req.file

  try {
    await sendpdf(Email, pdf);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


  mongoose.connect("mongodb+srv://Payment:0r2WQgUnKteLXgYF@payment.9nyqfls.mongodb.net/United").then(() => {
  console.log("db  is running on port 3003 ")
  app.listen(3003, () => {
    console.log("db and server is running on port 3003 ")
  })
});
