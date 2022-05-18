const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Author= new Schema({ 
  //id: String,
  name: String,
  description: String,
});

module.exports = mongoose.model('Author', Author); 