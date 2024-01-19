const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PlanModel = require("./models/plan")
const mainPlanModel = require("./models/unitedeldt")
const studentModel = require("./models/plan copy")
const { sendloginpassword } = require("./Loginpass");
const {Contactusemail}= require("./Contactusemail")
const multer = require("multer"); // Add multer
const upload = multer();
 const stripe = require('stripe')('sk_test_51O5F9gFZtgAr5eHPmu3BtPDmmuRPWUmVoitQHFCugNPa1fQVqpOdgefaYVrEfHOVC0Jipu6byrfYmARCWjqyjpy400hyORLjgo');
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const paymentModel = require("./models/Payment")
const jwt = require('jsonwebtoken');
const secretkey = '2783flksjda0/.-=--982jna,769384;'
const fs = require('fs');
const path = require('path');
const courseData = require('./Classa');
const Question = require('./models/Lesson');
const Course = require('./models/Courses');
const {Newpaper} = require("./Newspaper")
const { sendpassword } = require("./resetpass")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/getCourseChapters/:studentId/:courseId', async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Find the student by ID
    const student = await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the student is enrolled in the specified course
    const enrollment = student.courseEnrollments.find(
      (enrollment) => enrollment.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(400).json({ error: 'Student is not enrolled in the specified course' });
    }

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Extract information based on language and lesson index
    const { language, lessonIndex } = enrollment;

    // Filter chapters by language and get the chapters up to the lessonIndex
    const chaptersToSend = course.chapters
      .filter((chapter) => chapter.language === language)
      .slice(0, lessonIndex + 1);

    // Calculate student progress percentage
    const totalChapters = course.chapters.length;
    const progressPercentage = (lessonIndex + 1) / totalChapters * 100;

    return res.json({
      studentProgress: {
        lessonIndex: lessonIndex + 1,
        totalChapters,
        progressPercentage,
      },
      courseName: course.courseName,
      language,
      chapters: chaptersToSend,
     
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/getChapterTitles/:studentId/:courseId', async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Find the student by ID
    const student = await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the student is enrolled in the specified course
    const enrollment = student.courseEnrollments.find(
      (enrollment) => enrollment.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(400).json({ error: 'Student is not enrolled in the specified course' });
    }

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Extract information based on language and lesson index
    const { language, lessonIndex } = enrollment;

    // Get chapter titles and availability status
    const chapterTitles = course.chapters
      .filter((chapter) => chapter.language === language) // Filter chapters by language
      .map((chapter, index) => {
        return {
          title: chapter.lessonTitle,
          chapId:chapter._id,
          available: index <= lessonIndex, // Chapter is available if its index is less than or equal to lessonIndex
        };
      });

    return res.json({
      courseName: course.courseName,
      language,
      chapters: chapterTitles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/getLastChapter/:studentId/:courseId', async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Find the student by ID
    const student = await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the student is enrolled in the specified course
    const enrollment = student.courseEnrollments.find(
      (enrollment) => enrollment.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(400).json({ error: 'Student is not enrolled in the specified course' });
    }

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Extract information based on language and lesson index
    const { language, lessonIndex } = enrollment;

    // Get the last available chapter
    const lastChapter = course.chapters
      .filter((chapter) => chapter.language === language) // Filter chapters by language
      .filter((chapter, index) => index <= lessonIndex) // Filter available chapters
      .pop(); // Get the last chapter

    if (!lastChapter) {
      return res.json({ error: 'No available chapters' });
    }

    return res.json({
      chapterId: lastChapter._id,
      chapterTitle: lastChapter.lessonTitle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






app.get('/api/student/:studentId/courses', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

     const coursesData = await fetchCoursesData(student.courseEnrollments);
    const completedCourses = [];
    const uncompletedCourses = [];

    for (const courseData of coursesData) {
      const completed = courseData.completed;
      const totalChapters = courseData.totalChapters;
      const completedChapters = courseData.completedChapters;
      const studentProgress = calculateStudentProgress(completedChapters, totalChapters);

      if (completed) {
        completedCourses.push({
          courseName: courseData.courseName,
          courseNameid: courseData.courseNameid,
          totalChapters: totalChapters,
          completedChapters: completedChapters,
          studentProgress: studentProgress,
        });
      } else {
        uncompletedCourses.push({
          courseName: courseData.courseName,
          courseNameid: courseData.courseNameid,
          totalChapters: totalChapters,
          completedChapters: completedChapters,
          studentProgress: studentProgress,
        });
      }
    }

    res.status(200).json({
      completedCourses: completedCourses,
      uncompletedCourses: uncompletedCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
async function fetchCoursesData(courseEnrollments) {
  const coursesData = [];

  for (const enrollment of courseEnrollments) {
    const courseId = enrollment.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      console.warn(`Course with ID ${courseId} not found.`);
      continue;
    }

    const language = enrollment.language;
    const totalChapters = getTotalChapters(course, language);
    const completedChapters = enrollment.lessonIndex ; // Assuming lessonIndex is 0-based

    coursesData.push({
      courseName: course.courseName,
      courseNameid: course._id,
      completed: enrollment.completed || false,
      totalChapters: totalChapters,
      completedChapters: completedChapters,
    });
  }

  return coursesData;
}
function getTotalChapters(course, language) {
  let totalChapters = 0;

  for (const chapter of course.chapters) {
    if (chapter.language === language) {
      totalChapters += 1;
    }
  }

  return totalChapters;
}


function calculateStudentProgress(completedChapters, totalChapters) {
  const progressPercentage = (completedChapters / totalChapters) * 100 || 0;
  return `${progressPercentage.toFixed(2)}%`;
}




app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find({}, "courseName category price image").exec();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/addQuestions', async (req, res) => {
  try {
    const { lessonId, questions } = req.body;
    // Validate incoming data
    if (!lessonId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid data. Please provide all required fields.' });
    }

const question = await Question.create(req.body)

    res.status(201).json({ message: 'Questions added successfully.' });
  } catch (error) {
    console.error('Error adding questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/getQuestionsByLessonId/:lessonId', async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    if (!lessonId) {
      return res.status(400).json({ error: 'Invalid lesson ID.' });
    }

    // Fetch questions based on lessonId, excluding the isCorrect field
    const questions = await Question.find({ lessonId }, { 'questions.options.isCorrect': 0 });

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions by lesson ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/addCourseWithLessons', async (req, res) => {
  try {
    const { courseName, category, price, image, chapters } = req.body;
    // Validate incoming data
    if (!courseName || !category || !price || !image || !chapters) {
      return res.status(400).json({ error: 'Invalid data. Please provide all required fields.' });
    }

    // Create a new course document with the provided data
    const newCourse = new Course({
      courseName,
      category,
      price,
      image,
      chapters,
    });

    // Save the new course document
    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error adding course with lessons:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/addLesson/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const { lessonTitle, language, pages } = req.body;

  try {
    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Validate incoming data
    if (!language || !lessonTitle || !pages) {
      return res.status(400).json({ error: 'Invalid data. Please provide language, lessonTitle, and pages.' });
    }

    // Add the lesson directly to the course
    course.chapters.push({
      lessonTitle,
      language,
      pages,
    });

    // Save the updated course
    await course.save();

    res.status(201).json({ message: 'Lesson added to the course successfully' });
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

app.post('/api/create-payment-intents', async (req, res) => {
  try {
    const existingStudent = await studentModel.findOne({ Email: req.body.Email });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
    });

    if (existingStudent) {
      for (const enrollment of req.body.courseEnrollments) {
        existingStudent.courseEnrollments.push(enrollment);
      }
      await existingStudent.save();

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: 'User found and updated with new course enrollments',
      });
    } else {
      const student = await studentModel.create({
        ...req.body,
        courseEnrollments: req.body.courseEnrollments,
      });

      const generatedPassword = student.password;
      const emailOf = student.Email;
      // Assuming you have a function to send login details to the user
       await sendloginpassword(emailOf, generatedPassword);

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: 'User created with course enrollments',
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
