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
      "Name": "Drama",
      "Description": "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.[1] The drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre,[2] such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy). These terms tend to indicate a particular setting or subject matter, or they combine a drama's otherwise serious tone with elements that encourage a broader range of moods. To these ends, a primary element in a drama is the occurrence of conflict—emotional, social, or otherwise—and its resolution in the course of the storyline."
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
  },
    {
    "Title": "Bridget Jones' Diary",
    "Release Year": 2001,
    "Setting": "England, London",
    "Description": "Bridget Jones is determined to improve herself while she looks for love in a year in which she keeps a personal diary.",
    "Genre": {
      "Name": "Comedy",
      "Description": "The comedy genre refers to a category of entertainment that aims to amuse and entertain audiences by using humor, wit, and comedic situations. Comedies are created with the primary intention of eliciting laughter and providing lighthearted enjoyment. They encompass a wide range of styles, tones, and themes, appealing to various tastes and audiences." },
    "Director": {
      "Name": "Sharon Maguire",
      "Bio": "was born in Aberystwyth, Cardiganshire, Wales, UK. She is a director and producer, known for Bridget Jones's Diary (2001), Bridget Jones's Baby (2016) and Incendiary (2008).The character 'Shazza' featured in the books and films of Bridget Jones's Diary was actually based on her personality since she is good friends with the writer of the books.She is also a BBC Documentary Filmmaker. Sharon read English and Drama at Aberystwyth University in Wales before taking a postgraduate course in journalism at the City University in London.She directed one Oscar nominated performance: Renée Zellweger in Bridget Jones's Diary (2001).",
      "Birth": 1960
    },
    "ImageURL": "https://en.wikipedia.org/wiki/File:BridgetJonesDiaryMoviePoster.jpg#/media/File:BridgetJonesDiaryMoviePoster.jpg",
    "Featured": true
  },
      {
    "Title": "Never Let Me Go",
    "Release Year": 2010,
    "Setting": "England",
    "Description": "The lives of three friends, from their early school days into young adulthood, when the reality of the world they live in comes knocking.",
    "Genre": {
      "Name": "Drama",
      "Description": "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.[1] The drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre,[2] such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy). These terms tend to indicate a particular setting or subject matter, or they combine a drama's otherwise serious tone with elements that encourage a broader range of moods. To these ends, a primary element in a drama is the occurrence of conflict—emotional, social, or otherwise—and its resolution in the course of the storyline.",
    },
    "Director": {
      "Name": "Mark Romanek",
      "Bio": "born in Chicago, Illinois, USA. He is a director and producer, known for Never Let Me Go (2010), One Hour Photo (2002) and Tales from the Loop (2020). He is married to Brigette Romanek.",
      "Birth": 1959
    },
    "ImageURL": "https://en.wikipedia.org/wiki/File:Neverletmegoposterquad.jpg#/media/File:Neverletmegoposterquad.jpg",
    "Featured": false
  },
        {
    "Title": "Belfast",
    "Release Year": 2021,
    "Setting": "Northern Ireland, Belfast",
    "Description": "A young boy and his working-class Belfast family experience the tumultuous late 1960s.",
    "Genre": {
      "Name": "Drama",
      "Description": "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.[1] The drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre,[2] such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy). These terms tend to indicate a particular setting or subject matter, or they combine a drama's otherwise serious tone with elements that encourage a broader range of moods. To these ends, a primary element in a drama is the occurrence of conflict—emotional, social, or otherwise—and its resolution in the course of the storyline.",
    },
    "Director": {
      "Name": "Kenneth Branagh",
      "Bio": "Kenneth Charles Branagh was born in Belfast, Northern Ireland, to parents William Branagh, a plumber and carpenter, and Frances (Harper), both born in 1930. He has two siblings, William Branagh, Jr. (born 1955) and Joyce Branagh (born 1970). When he was nine, his family escaped The Troubles by moving to Reading, Berkshire, England. At 23, Branagh joined the Royal Shakespeare Company, where he took on starring roles in 'Henry V' and 'Romeo and Juliet'. He soon found the RSC too large and impersonal and formed his own, the Renaissance Theatre Company, which was disbanded in 1992 when he moved more fully into filmmaking. At 29, he directed Henry V (1989), where he also co-starred with his then-wife, Emma Thompson. The film brought him Best Actor and Best Director Oscar nominations. In 1993, he brought Shakespeare to mainstream audiences again with his hit adaptation of Much Ado About Nothing (1993), which featured an all-star cast that included, among others, Denzel Washington, Michael Keaton and Keanu Reeves. At 30, he published his autobiography and, at 34, he directed and starred as 'Victor Frankenstein' in the big-budget adaptation of Mary Shelley's novel, Frankenstein (1994), with Robert De Niro as the monster himself. In 1996, Branagh wrote, directed and starred in a lavish adaptation of Hamlet (1996). His superb film acting work also includes a wide range of roles such as in Celebrity (1998), Wild Wild West (1999), The Road to El Dorado (2000), Valkyrie (2008) and his stunning portrayal of Laurence Olivier in My Week with Marilyn (2011), where once again he offered a great performance that was also nominated for an Academy Award.",
      "Birth": 1960
    },
    "ImageURL": "https://en.wikipedia.org/wiki/File:Belfast_poster.jpg#/media/File:Belfast_poster.jpg",
    "Featured": true
  },
          {
    "Title": "Elisabeth",
    "Release Year": 2007,
    "Setting": "England",
    "Description": "A mature Queen Elizabeth endures multiple crises late in her reign including court intrigues, an assassination plot, the Spanish Armada, and romantic disappointments.",
    "Genre": {
      "Name": "Biography",
      "Description": "The biography, or biopic, is a genre that portrays the life story of a real person, often a notable individual or historical figure. They aim to provide a depiction of the subject's personal history, achievements, challenges, and impact on society."
 },
    "Director": {
      "Name": "Shekhar Kapur",
      "Bio": "born in Lahore, Punjab, British India [now Pakistan]. He is a director and actor, known for Elizabeth (1998), Elizabeth: The Golden Age (2007) and Bandit Queen (1994). He was previously married to Suchitra Krishnamoorthi.",
      "Birth": 1945
    },
    "ImageURL": "https://en.wikipedia.org/wiki/File:Elizabeth_Poster.jpg#/media/File:Elizabeth_Poster.jpg",
    "Featured": true
  },
            {
    "Title": "Outlander",
    "Release Year": 2014,
    "Setting": "England, Scottland, United States of America, France",
    "Description": "Claire Beauchamp Randall, a nurse in World War II, mysteriously goes back in time to Scotland in 1743. There, she meets a dashing Highland warrior and gets drawn into an epic rebellion.",
    "Genre": {
        "Name": "Adventure",
        "Description": "The adventure genre features exciting journeys, quests, or expeditions undertaken by characters who often face challenges, obstacles, and risks in pursuit of a goal. Adventures can take place in a wide range of settings, from exotic and fantastical locations to historical or even everyday environments."
      },
    "Director": {
      "Name": "n/a",
      "Bio": "n/a",
      "Birth": "n/a",
    },
    "ImageURL": "https://en.wikipedia.org/wiki/File:Outlander-TV_series-2014.jpg#/media/File:Outlander-TV_series-2014.jpg",
    "Featured": false
  },
];

app.get('/', (req, res) => {
    res.send('Welcome to my movie app myFlix!');
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.')
});

app.get('/documentation.html', express.static('public'));

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

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such director")
      }
})


//READ, gets the genre of a movie and its description

/* app.get('/movies/movie/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const movie = movies.find(movie => movie.Genre.Name === genreName);

  if (movie) { 
    res.status(200).json(movie.Genre);
  } else {
    res.status(400).send('no such genre')
      }
}) */

//READ, gets the director's name

/* app.get('/movies/movie/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const movie = movies.find( movie => movie.Director.Name === directorName);

  if (movie) {
    res.status(200).json(movie.Director);
  } else {
    res.status(400).send("no such director")
      }
}) */

app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director; // Due to be discussed in depth at a session with mentor

  if (director) {
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
  console.log('Your app is listening on port 8080.');
});
