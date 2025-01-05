const express = require('express');
const Classroom = require('../models/classroomModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const ClassroomJoin = require('../models/classroomJoinModel');
const responseFunction = require('../utils/responseFunction');
const authTokenHandler = require('../middlewares/checkAuthToken');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const Quiz = require('../models/quizModel');
const mongoose = require('mongoose');
const QuizResult = require('../models/QuizResult');


// Utility function to send email
const mailer = async (receiverEmail, code) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.COMPANY_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: "Team Educonnect",
        to: receiverEmail,
        subject: "OTP for Educonnect",
        text: `Your OTP is ${code}`,
        html: `<b>Your OTP is ${code}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
    return !!info.messageId;
};

// Route to create a classroom
router.post('/create', authTokenHandler, async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return responseFunction(res, 400, 'Classroom name is required', null, false);
    }

    try {
        const newClassroom = new Classroom({
            name,
            description,
            owner: req.userId,
        });

        await newClassroom.save();
        return responseFunction(res, 201, 'Classroom created successfully', newClassroom, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});

// Route to fetch classrooms created by the user
router.get('/classroomscreatedbyme', authTokenHandler, async (req, res) => {
    try {
        const classrooms = await Classroom.find({ owner: req.userId });
        return responseFunction(res, 200, 'Classrooms fetched successfully', classrooms, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});

// Route to fetch classroom by ID
router.get('/getclassbyid/:classid', authTokenHandler, async (req, res) => {
    const { classid } = req.params;

    try {
        // Fetch the classroom, populating both the posts and quizId in each post
        const classroom = await Classroom.findById(classid)
            .populate({
                path: 'posts', // Populate the posts
                populate: {
                    path: 'quizId', // Populate quizId in each post
                    model: 'Quiz', // The model name of the Quiz collection
                }
            });
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        // Debugging: Log the classroom object and posts
        console.log('Classroom:', classroom);

        return responseFunction(res, 200, 'Classroom fetched successfully', classroom, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});



// Configure multer for file uploads
const multer = require('multer');
const fileUpload = require('../middlewares/multer');

router.post('/addpost', authTokenHandler, fileUpload.single('pdf'), async (req, res) => {
    const { title, description, classId } = req.body;
    const file = req.file;
    let quizQuestions = [];

    // Parse the `quiz` field if it exists in the request body
    if (req.body.quiz) {
        try {
            quizQuestions = JSON.parse(req.body.quiz);
            console.log('Parsed Quiz Questions:', JSON.stringify(quizQuestions, null, 2));
        } catch (err) {
            return responseFunction(res, 400, 'Invalid quiz format. Please provide valid JSON.', null, false);
        }
    }

    // Function to validate quiz structure
    const validateQuizQuestions = (questions) => {
        if (!Array.isArray(questions)) return 'Questions should be an array.';
        for (const question of questions) {
            if (!question.question || typeof question.question !== 'string') return 'Each question must have a valid "question" field.';
            if (!Array.isArray(question.options)) return 'Each question must have an "options" array.';
            for (const option of question.options) {
                if (!option.option || typeof option.option !== 'string') return 'Each option must have a valid "option" field.';
                if (typeof option.isCorrect !== 'boolean') return 'Each option must have an "isCorrect" boolean.';
            }
        }
        return null;
    };

    // Validate quiz questions
    const validationError = validateQuizQuestions(quizQuestions);
    if (validationError) {
        return responseFunction(res, 400, `Quiz validation error: ${validationError}`, null, false);
    }

    try {
        console.log('Received Request:', { title, description, classId, file, quizQuestions });

        const classroom = await Classroom.findById(classId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        if (classroom.owner.toString() !== req.userId) {
            return responseFunction(res, 403, 'Unauthorized to add posts to this classroom', null, false);
        }

        // Create a new post
        const newPost = new Post({
            title,
            description,
            classId,
            createdBy: req.userId,
            file: file ? file.buffer : null,
            fileType: file ? file.mimetype : null,
        });

        await newPost.save();
        classroom.posts.push(newPost._id);

        // If quizQuestions are provided, create a new quiz
        if (quizQuestions.length > 0) {
            const newQuiz = new Quiz({
                classId,
                title: `Quiz for Post: ${title}`,
                questions: quizQuestions,
                createdBy: req.userId,
            });

            await newQuiz.save();
            newPost.quizId = newQuiz._id; // Link the quiz to the post
            await newPost.save();
        }

        await classroom.save();
        return responseFunction(res, 201, 'Post created successfully', newPost, true);
    } catch (err) {
        console.error('Error creating post or quiz:', err);
        if (err instanceof multer.MulterError) {
            return responseFunction(res, 400, 'File upload error', err.message, false);
        }
        return responseFunction(res, 500, 'Internal server error', err.message || err, false);
    }
});





  // downlosd post
  router.get('/download/:postId', async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
  
      if (!post || !post.file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      res.set({
        'Content-Type': post.fileType,
        'Content-Disposition': `attachment; filename="${post.title}.pdf"`,
      });
  
      res.send(post.file);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  });
  


//To delete a post
// Route to delete a post
router.delete('/deletepost/:postId', authTokenHandler, async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return responseFunction(res, 404, 'Post not found', null, false);
        }

        // Check if the user is the creator of the post
        if (post.createdBy.toString() !== req.userId) {
            return responseFunction(res, 403, 'Unauthorized to delete this post', null, false);
        }

        // Remove the post from the classroom's posts array
        const classroom = await Classroom.findById(post.classId);
        if (classroom) {
            classroom.posts = classroom.posts.filter(p => p.toString() !== postId);
            await classroom.save();
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        return responseFunction(res, 200, 'Post deleted successfully', null, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});


// Route to search classrooms
router.get('/classrooms/search', async (req, res) => {
    const term = req.query.term;

    if (!term) {
        return responseFunction(res, 400, 'Search term is required', null, false);
    }

    try {
        const results = await Classroom.find({
            name: { $regex: new RegExp(term, 'i') },
        });

        if (results.length === 0) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        return responseFunction(res, 200, 'Search results', results, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});

// Route to request joining a classroom
router.post('/request-to-join', async (req, res) => {
    const { classroomId, studentEmail } = req.body;

    if (!classroomId || !studentEmail) {
        return responseFunction(res, 400, 'Classroom ID and student email are required', null, false);
    }

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        const classOwner = await User.findById(classroom.owner);
        if (!classOwner) {
            return responseFunction(res, 404, 'Class owner not found', null, false);
        }

        const code = Math.floor(100000 + Math.random() * 900000);
        const isSent = await mailer(classOwner.email, code);

        if (!isSent) {
            return responseFunction(res, 500, 'Failed to send OTP', null, false);
        }

        const newClassroomJoin = new ClassroomJoin({
            classroomId,
            studentEmail,
            code,
            classOwnerEmail: classOwner.email,
        });

        await newClassroomJoin.save();
        return responseFunction(res, 200, 'OTP sent to the class owner', null, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});

// Route to verify OTP and add student to the classroom
router.post('/verify-otp', authTokenHandler, async (req, res) => {
    const { classroomId, studentEmail, otp } = req.body;

    if (!classroomId || !studentEmail || !otp) {
        return responseFunction(res, 400, 'Classroom ID, student email, and OTP are required', null, false);
    }

    try {
        const joinRequest = await ClassroomJoin.findOne({
            classroomId,
            studentEmail,
            code: otp,
        });

        if (!joinRequest) {
            return responseFunction(res, 400, 'Invalid OTP or join request not found', null, false);
        }

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return responseFunction(res, 404, 'Classroom not found', null, false);
        }

        const student = await User.findOne({ email: studentEmail });
        if (!student) {
            return responseFunction(res, 404, 'Student not found', null, false);
        }

        if (!classroom.students.includes(student._id)) {
            classroom.students.push(student._id);
            await classroom.save();
        }

        // Mark the join request as successfully processed without deleting it
        joinRequest.status = 'verified'; // Add a status field to track verification state (optional)
        await joinRequest.save();

        return responseFunction(res, 200, 'Successfully joined the class', null, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});

// Route to fetch classrooms for a student
router.get('/classroomsforstudent', authTokenHandler, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return responseFunction(res, 404, 'User not found', null, false);
        }

        const classrooms = await Classroom.find({ students: user._id });
        if (classrooms.length === 0) {
            return responseFunction(res, 404, 'No classrooms found for this student', null, false);
        }

        return responseFunction(res, 200, 'Classrooms fetched successfully', classrooms, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
});

// Express.js route
router.post('/submit-quiz', async (req, res) => {
    const { classId, userId, score } = req.body;
  
    if (!classId || !userId || score == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const newResult = await QuizResult.create({
        classId,
        userId,
        score,
        submittedAt: new Date(),
      });
  
      res.status(201).json({ message: 'Quiz results saved successfully', data: newResult });
    } catch (error) {
      console.error('Error saving quiz results:', error);
      res.status(500).json({ message: 'Failed to save quiz results' });
    }
  });


  // Express.js route to fetch quiz results
router.get('/quiz-results/:classId', async (req, res) => {
    const { classId } = req.params;
    console.log("Params : ", req.params);
    
  
    try {
      // Fetch the class to ensure the user is the owner
      const classroom = await Classroom.findById(classId);
      if (!classroom) {
        return res.status(404).json({ message: 'Class not found' });
      }

        // Extract the ownerId (userId) from the classroom details
        const userId = classroom.owner;

        console.log("Owner ID (User ID):", userId);
  
      if (String(classroom.owner) !== String(userId)) {
        return res.status(403).json({ message: 'Unauthorized to view quiz results' });
      }
  
      // Fetch quiz results for the class
      const quizResults = await QuizResult.find({ classId })
        .populate('userId', 'name email') // Fetch user details (e.g., name and email)
        .sort('-submittedAt'); // Sort by submission date, latest first
  
      res.status(200).json({ message: 'Quiz results fetched successfully', data: quizResults });
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      res.status(500).json({ message: 'Failed to fetch quiz results' });
    }
  });
  
  


module.exports = router;
