const express = require("express"),
      morgan = require("morgan");
      fs = require("fs"),
      path = require("path");
      bodyParser = require("body-parser"),
      uuid = require("uuid");
      mongoose = require("mongoose");
      Models = require("./models.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Movies = Models.Movie;
const Users = Models.User;

//app.use(bodyParser.json());

app.use(morgan('common'));

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
app.get('/users', async (req, res) => {
  await Users.find()
    .then((Users) => {
      res.status(201).json(Users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
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
app.put('/users/:username', async (req, res) => {
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

app.post('/users/:Username/movies/:movieID', async (req, res) => {
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

app.delete('/users/:Username/movies/:movieID', async (req, res) => {
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
   /*  const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
      user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
      res.status(200).send(req.params.movieTitle + " has been removed from user" + req.params.id + "'s array");
    } else {
      res.status(400).send("no such user")
    } */


  //DELETE allows users to be deleted

app.delete('/users/:Username', async (req, res) => {
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

app.get('/movies', async (req, res) => {
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

  app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send("no such movie")
    }
  })

  app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send("no such director")
    }
  })

  app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director; // Due to be discussed in depth at a session with mentor

    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send("no such director")
    }
  })

  mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went awry...');
  }); // always  last in a chain of middleware, after all other instances of app.use() and route calls (e.g., after app.get(), app.post(), etc.) but before app.listen()//

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
