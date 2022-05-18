var express = require('express');
const {graphqlHTTP} = require('express-graphql');
const app = express();
const port = 4000;

const schema = require('./schema/model');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://catafest-work:EDCEDCEDC77@cluster0.qgeie.mongodb.net/?retryWrites=true&w=majority')
mongoose.connection.once('open', () => {
  console.log('... connected to database')
});

app.get('/', function(req, res) { 
  res.send("Welcome to my GraphQl app"); 
})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true // see man is 'graphiql' not 'graphql'
}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//mongodb+srv://catafest-work:<password>@cluster0.qgeie.mongodb.net/?retryWrites=true&w=majority