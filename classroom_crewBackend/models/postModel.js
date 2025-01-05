// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const postSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   classId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Class',
//     required: true,
//   },
//   createdBy: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   }
// },{timestamps:true});

// const Post = mongoose.model('Post', postSchema);
// module.exports = Post;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  file: {
    type: Buffer, // Binary data for the uploaded file
    default: null,
  },
  fileType: {
    type: String, // MIME type of the uploaded file
    default: null,
  },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, // Ensure this field exists

}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

