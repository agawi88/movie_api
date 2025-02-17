const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const models = require("./models.js");
bcryptjs = require('bcryptjs');


const Movies = models.Movie;
const Users = models.User;

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
 // Morgan middleware
app.use(morgan('combined'));

const { check, validationResult } = require('express-validator');


mongoose.connect("mongodb://localhost:27017/myFlixDB", {
useNewUrlParser: true,
useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connection now open');
});
mongoose.connection.on('error', (err) => {
  console.log(err);
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan("combined", { stream: accessLogStream }));

app.get('/',(req, res) => {
    res.send('Welcome to my movie app myFlix!');
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.')
});

app.get('/documentation.html', express.static('public'));

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/Users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user (cannot have passport-authentication in order to allow users to register)
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  async (req, res) => {
 // check the validation object for errors
    let errors = validationResult(req);
        if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            DateOfBirth: req.body.DateOfBirth,
          })
          .then((user) =>{res.status(201).json(user) })
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


//UPDATE allows to update their username
app.put('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  
  // CONDITION TO CHECK ADDED HERE
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send("Permission denied");
  }
  // CONDITION ENDS
  
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      DateOfBirth: req.body.DateOfBirth
    }
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser).send("User has been updated");
      return;
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
      return;
    })
  
}); 

  //CREATE/POST allows the user to add a movie to their favorits with just an info that it has been added

 app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser).send(req.params.MovieID + " has been added to user" + req.params.Username + "'s array");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err, "no such user!");
    });
}); 

  //DELETE allows the user to delete a movie from their favorits with just an info that it has been deleted

app.put('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), async (req, res) =>
{
  await Users.findOneAndUpdate({ Username: req.params.Username },
      {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.json(updatedUser).send(req.params.MovieID + " has been deleted to user" + req.params.Username + "'s array");
      }
      })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
}); 

app.delete('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
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
    

  //MOVIES
  //Gets the list of ALL movies and their Data in JSON

app.get('/movies', passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Movies.find()
    .then((Movies) => {
      return res.status(201).json(Movies);
    })  
      .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  })

  //Gets the data about a single movie, by name

app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((Movie) => {
      res.json(Movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Gets the Genre by Genre Name

app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
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

// Gets data about the director by name

app.get("/movies/director/:directorName", passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Director);
      } else {
        res.status(400).send("No such director");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
}); 

  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went awry...');
  }); // always  last in a chain of middleware, after all other instances of app.use() and route calls (e.g., after app.get(), app.post(), etc.) but before app.listen()//

  
const port = process.env.PORT || '8080';
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port');
  });
