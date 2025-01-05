// models/quizModel.js
const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    questions: [
        {
            question: { type: String, required: true },
            options: [
                { option: { type: String, required: true }, isCorrect: { type: Boolean, required: true } },
            ],
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('Quiz', QuizSchema);
