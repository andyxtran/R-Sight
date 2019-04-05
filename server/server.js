const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const db = require('./db/userModel');
const userController = require('./controllers/userController');
const sessionController = require('./controllers/sessionController');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

var MyGraphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use(express.static(__dirname + '/frontend/images'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/graphql', graphqlHTTP({
  schema: MyGraphQLSchema,
  rootValue: root,
  graphiql: true
}));

// ------------ HOME PAGE --------------------------------------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/homePage.html'));
});

// --------------------- LOGIN PAGE ---------------------------------------------
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.post('/login', userController.verify, sessionController.startSession, (req, res) => res.status(200).json({ jwt: req.locals.jwt }));

// ------------------------- SIGN UP PAGE -------------------------------------
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/signup.html'));
});

app.post('/signup', userController.signup, (req, res, next) => {
  if (res.locals.result) res.status(200).send('you are signed up!');
  else res.status(404).send('Error');
});

// ---------------------------STYLE SHEET  ---------------------
app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/styles.css'));
});

app.get('/styles-user.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/styles-user.css'));
});


// ---------------------------------------------USER PAGE ----------------
app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/userpage.html'));
});

app.listen(3000);

module.exports = app;
