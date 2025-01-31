const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models.js");
//const PORT = 27017;
//const url = "mongodb://localhost:27017/myFlixDB";
// const db = mongoose.connection;

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Movie;
const Directors = Models.Director;
const Titles = Models.Title;

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common'));

mongoose.connect("mongodb://localhost:27017/mmyFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //dbName: 'myFlixDB'
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connection now open');
});
mongoose.connection.on('error', (err) => {
  console.log(err);
});

/* mongoose.connection.on('connected', ()=>{
  console.log('MongoDB connected at port 27017');
  app = express();
}); */

/* const initMongo = () => new Promise(resolve => mongoose.connection.on('connected', resolve));
const initExpress = () => new Promise(resolve => mongoose.connection.on('connected', resolve));

initMongo()
    .then(initExpress)
    .catch(e => {
        error({error:"boot", cause: e})
        process.exit(-1)
    })



// end of troubleshooting code */

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan("combined", {stream: accessLogStream}));
app.get('/', (req, res) => {
    res.send('Welcome to my movie app myFlix!');
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.')
});

app.get('/documentation.html', express.static('public'));

// Get all users
app.get('/Users', async (req, res) => {
  await Users.find()
    .then((Users) => {
      res.status(201).json(Users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/Users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((User) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user
app.post('/Users', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username })
    .then((User) => {
      if (User) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            DateOfBirth: req.body.DateOfBirth,
          })
          .then((User) =>{res.status(201).json(User) })
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
app.put('/Users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.body.Username }, {
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
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
  
});

  //CREATE/POST allows the user to add a movie to their favorits with just an info that it has been added

app.post('/Users/:Username/Movies/:movieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.body.Username },
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

app.delete('/Users/:Username/Movies/:movieID', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.body.Username },
    { new: true })
    .then((updatedUser) => {
      if (!User) {
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

app.delete('/Users/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((User) => {
      if (!User) {
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

app.get('/Movies', async (req, res) => {
    await Movies.find()
    .then((Movies) => {
      res.status(201).json(Movies);
    })  
      .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  })

  //Gets the data about a single movie, by name

app.get('/Movies/:Title', async (req, res) => {
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

app.get('/Movies/Genres/:genreName', async (req, res) => {
  await Movies.findOne({ "Genres.Name": req.params.genreName })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Genre);
      } else {
        res.status(400).send("No such genre");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
/*   const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such director")
  }
}); */

// Gets data about the director by name

app.get('/Movies/directors/:directorName', async (req, res) => {
    await Movies.findOne({ "Directors.Name": req.params.directorName })
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
/*   const { directorName } = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director; // Due to be discussed in depth at a session with mentor

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director")
  }
}); */
  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went awry...');
  }); // always  last in a chain of middleware, after all other instances of app.use() and route calls (e.g., after app.get(), app.post(), etc.) but before app.listen()//

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
  });
