const pg = require('pg');

const uri = 'postgres://pfa:pfa@localhost';
const client = new pg.Client(uri);

const bcrypt = require('bcrypt');
const saltRounds = 10;

client.connect((err) => {
  err ? console.log(err) : console.log('connected to psql db');
});

const userModel = {};

client
  .query(
    `
  CREATE TABLE IF NOT EXISTS users
    (
      _id SERIAL PRIMARY KEY,
      f_name VARCHAR(100),
      l_name VARCHAR(100),
      username text UNIQUE NOT NULL,
      email text UNIQUE,
      password text NOT NULL,
      created TIMESTAMP DEFAULT NOW() NOT NULL
  );
`,
  )
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack));

userModel.verify = async (req) => {
  const { username, password } = req.body;
  return client
    .query(`SELECT * FROM users WHERE username = '${username}'`)
    .then((res) => {
      if (bcrypt.compareSync(password, res.rows[0].password)) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.log('ERROR with querying database', err);
      return false;
    });
};

userModel.createUser = async (req, res) => {
  const {
    f_name, l_name, username, email, password,
  } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return client
    .query(
      `
    INSERT INTO users 
    (f_name, l_name, username, email, password)
    VALUES (
        '${f_name}', 
        '${l_name}', 
        '${username}', 
        '${email}', 
        '${hash}'
      );
  `,
    )
    .then(result => result)
    .catch(e => console.log('ERROR with creating user in database', e.stack));
};

module.exports = userModel;
