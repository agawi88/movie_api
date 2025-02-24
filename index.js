const express = require("express");
const morgan = require("morgan");
const passport = require('passport');
const fs = require("fs");
const path = require("path");

const { check, validationResult } = require('express-validator');
const mongoose = require("mongoose");
const models = require("./models.js");
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const Movies = models.Movie;
const Users = models.User;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
  console.log('MongoDB connection now open');
});
mongoose.connection.on('error', (err) => {
  console.log(err);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

require('./auth')(app);
require('./passport');

// Morgan middleware
app.use(morgan('combined'));

// Static request
app.use(express.static('public'));

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan("combined", { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send('Welcome to my movie app myFlix!');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.')
});

app.get('/documentation.html');

// USERS

// Get all users
app.get('/users', /* passport.authenticate('jwt', { session: false }), */ async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/Users/:Username', /*passport.authenticate('jwt', { session: false }),*/ async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a user (cannot have passport-authentication in order to allow users to register)
app.post('/users', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          DateOfBirth: req.body.DateOfBirth,
        })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update allows to update their username
app.put('/users/:Username', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

    // Check if user is authorized to update this username
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send("Permission denied");
  }

   let hashedPassword = Users.hashPassword(req.body.Password);
  
  await Users.findOneAndUpdate(
  { Username: req.params.Username }, 
  {
    $set: {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      DateOfBirth: req.body.DateOfBirth
          }
  },
  { new: true }
)
  .then(updatedUser => {
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.json(updatedUser).send("User has been updated");
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Add a movie to user's favorites
app.post('/users/:Username/movies/:MovieID', /*passport.authenticate('jwt', { session: false }),*/ async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  }, { new: true })
    .then((updatedUser) => {
      res.json(updatedUser).send(req.params.MovieID + " has been added to user " + req.params.Username + "'s array");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err, "no such user!");
    });
});

// Delete a movie from user's favorites
app.put('/users/:Username/movies/:MovieID', /*passport.authenticate('jwt', { session: false }),*/ async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.json(updatedUser).send(req.params.MovieID + " has been deleted from user " + req.params.Username + "'s array");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Delete a user
app.delete('/users/:Username', /*passport.authenticate('jwt', { session: false }),*/ async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " not found.");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// MOVIES

// Get the list of ALL movies and their data in JSON
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((Movies) => {
      return res.status(201).json(Movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get the data about a single movie, by name
app.get('/movies/:Title', /*passport.authenticate('jwt', { session: false }),*/ async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((Movie) => {
      res.json(Movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get the Genre by Genre Name
app.get('/movies/genre/:genreName', /*passport.authenticate('jwt', { session: false }),*/ async (req, res) => {
  await Movies.find({ "Genre.Name": { $regex: new RegExp(req.params.genreName, "i") } })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Genre);
      } else {
        res.status(404).send("No such genre");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get data about the director by name

app.get('/movies/genre/:genreName', async (req, res) => {
  await Movies.find({ "Genre.Name": { $regex: new RegExp(req.params.genreName, "i") } })
    .then((movies) => {
      console.log("Found movies:", movies); // Debugging

      if (movies.length === 0) {
        return res.status(404).json({ message: "No such genre found" });
      }

      // Extract only the first genre (assuming all are the same)
      let genreDetails = movies[0].Genre;
      console.log("Extracted genre details:", genreDetails); // Debugging

      res.status(200).json({
        Name: genreDetails.Name,
        Description: genreDetails.Description
      });
    })
    .catch((err) => {
      console.error("Database query error:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    });
});


/*app.get("/movies/director/:directorName", /*passport.authenticate('jwt', { session: false }), async (req, res) => {
  // await Movies.find({ "director.name": req.params.directorName })
  await Movies.find({ "Director.Name": { $regex: new RegExp(req.params.directorName, "i") } })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.director);
      } else {
        res.status(400).send("No such director.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});*/

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something went awry...');
});

const port = process.env.PORT || '8080';
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port number ' + port);
});