const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post= new Schema({ 
  id: String,
  title: String,
  author: String
});

module.exports = mongoose.model('Post', Post); 