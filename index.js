const express = require("express"),
    morgan = require("morgan");
    fs = require('fs'),
    path = require('path');
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

app.use(morgan('common'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan("combined", {stream: accessLogStream}));

let users = [
      {
    id: 1,
    name: "Anna",
    username: "Anna90",
    favoriteMovies: ["Pride and Prejudice"]
    },
          {
    id: 2,
    name: "John",
    username: "John25",
    favoriteMovies: []
  },
]

let movies = [
  {
    "Title": "Harry Potter and the Sorcerer's Stone",
    "Release Year": 2001,
    "Setting": "England, Scottland",
    "Description": "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.",
    "Genre": {
      "Name": "Fantasy",
      "Description": "The Fantasy genre features imaginative and often magical worlds, characters, and events. It explores realms beyond the boundaries of reality, featuring elements such as magic, mythical creatures, supernatural powers, and fantastical settings.",
    },
    "Director": {
      "Name": "Chris Columbus",
      "Bio": "an American filmmaker born in Spangler, Pennsylvania, Columbus studied film at New York University's Tisch School of the Arts where he developed an interest in filmmaking. After writing screenplays for several teen comedies in the mid-1980s, including Gremlins, The Goonies, and Young Sherlock Holmes, he made his directorial debut with a teen adventure, Adventures in Babysitting (1987). Columbus gained recognition soon after with the highly successful Christmas comedy Home Alone (1990) and Home Alone 2: Lost in New York (1992).",
      "Birth": 1958
    },
    "ImageURL": "https://en.wikipedia.org/wiki/Harry_Potter_and_the_Philosopher%27s_Stone_%28film%29#/media/File:Harry_Potter_and_the_Philosopher's_Stone_banner.jpg",
    "Featured": true
  },
  {
    "Title": "Pride and Prejudice",
    "Release Year": 2005,
    "Setting": "England",
    "Description": "In class-conscious England of the late 18th century, the five Bennet sisters—including the determined Elizabeth (Keira Knightley) and the young Lydia (Jena Malone)—are raised by their mother (Brenda Blethyn) with a single goal: a find suitable man and get married. When a wealthy bachelor moves into one of the neighborhood mansions, the Bennets are hopeful: the sisters are sure to find something they like among the new neighbor's many friends. But when Elizabeth meets the charming and - so they say - rather snobbish Mr. Darcy (Matthew MacFadyen) get the dolls dancing...",
    "Genre": {
      "Name": "Period drama",
      "Description": "The period drama subgenre transports audiences to the past, immersing them in historical contexts and offering insights into the lives, relationships, and challenges of characters from different time periods."
    },
    "Director": {
      "Name": "Joe Wright",
      "Bio": "Joe Wright is an English film director. He is best known for Pride & Prejudice (2005), Atonement (2007), Anna Karenina (2012), and Darkest Hour (2017).Wright always had an interest in the arts, especially painting. He would also make films on his Super 8 camera as well as spend time in the evenings acting in a drama club. He began his career working at his parents' puppet theatre. He also took classes at the Anna Scher Theatre School and acted professionally on stage and camera.",
      "Birth": 1972
    },
    "ImageURL": "https://upload.wikimedia.org/wikipedia/en/0/03/Prideandprejudiceposter.jpg",
    "Featured": true
  },
  {
    "Title": "Black Doves",
    "Release Year": 2024,
    "Setting": "England, London",
    "Description": "Helen embarks on a passionate affair with a man who has no idea what her secret identity is. Caught in the crosshairs when her lover falls victim to the dangerous London underworld, Helen's employers call in Sam to protect her.",
    "Genre": {
      "Name": "Thriller",
      "Description": "The thriller genre features suspense, tension, and excitement. These stories are known for keeping audiences on the edge of their seats and delivering intense emotional experiences by revolving around high-stakes situations, dangerous conflicts, and the constant anticipation of unexpected events.",
    },
    "Director": {
      "Name": "Lisa Gunning",
      "Bio": "an English film director, editor and writer. She began her career in the 1990s, following her graduation from University College London, where she studied English. In 1998, she met director Anthony Minghella while working on a spot for Comic Relief. Their long-running collaboration began with an adaptation of the theatrical short Play as part of the Samuel Beckett season for Channel 4, on which she served as editor. After working on some musical sequences in The Talented Mr. Ripley, her first feature as editor was Minghella's Breaking and Entering in 2006, followed by his pilot for the TV series The No.1 Ladies Detective Agency.",
      "Birth": 1985
    },
    "ImageURL": "https://upload.wikimedia.org/wikipedia/en/0/03/Prideandprejudiceposter.jpg",
    "Featured": false
  }
];

app.get('/', (req, res, next) => {
    res.send('Welcome to my movie app myFlix!');
});

app.get('/secreturl', (req, res, next) => {
    res.send('This is a secret url with super top-secret content.')
});

app.get('/documentation.html', express.static('public'));

app.get('/movies', (req, res, next) => {
    res.json(Movies);
});


//CREATE/POST allows to create a new username, that is: allows users to register

app.post('/users', (req, res) => {
  let newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send("users need names")
  }
})

//UPDATE allows to update their username
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  let updatedUser = req.body;

  let user = users.find( user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("users such user")
  }
})

//CREATE/POST allows the user to add a movie to their favorits with just an info that it has been added

app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(req.params.movieTitle +" has been added to user" + req.params.id + "'s array");
  } else {
    res.status(400).send("no such user")
  }
})

//DELETE allows the user to delete a movie from their favorits with just an info that it has been deleted

app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(req.params.movieTitle +" has been removed from user" + req.params.id + "'s array");
  } else {
    res.status(400).send("no such user")
  }
})

//DELETE allows users to be deleted

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id  );

  if (user) {
    users = users.filter( user => user.id != id );
    res.status(200).send("user" + req.params.id + " has been deleted");
  } else {
    res.status(400).send("no such user")
  }
})

//MOVIES
//Gets the list of ALL movies and their Data in JSON

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

//Gets the data about a single movie, by name

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie")
      }
})

//READ, gets the genre of a movie and its description

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  //const movie = movies.find( movie => movie.Title === title);
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (movie) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
      }
})

//READ, gets the director's name

app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (movie) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director")
      }
})





app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went awry...');
}); // always  last in a chain of middleware, after all other instances of app.use() and route calls (e.g., after app.get(), app.post(), etc.) but before app.listen()//

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});
