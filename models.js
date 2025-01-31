const mongoose = require('mongoose');
//const Schema = mongooseSchema; 

let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    ReleaseYear: { type: String, required: true },
    Setting: {type: String, required: true},
    Description: { type: String, required: true },
    Genres: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        DateOfBirth: Date,
        DeathYear: Date,
    },
    Actors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Actor' } ],
    ImageURL: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', movieSchema);
let Director = mongoose.model('Director', movieSchema);
let Title = mongoose.model('Title', movieSchema);


module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.Title = Title

















/*  For future use after the end of the course: the Movies_side of the App can be extended and optimized. Either by the use of references below or by switching to a relational DB /SQL.

Genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }], 
Directors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director' }],
Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }], 

let genreSchema = mongoose.Schema ({
    Name: {type: String, required: true},
    Description: {type: String, required: true},
});
    
   let directorSchema = mongoose.Schema ({
   Name: {type: String, required: true},
   Bio: {type: String, required: true},
   DateOfBirth: {type: Date, required: true},
   DeathYear: {type: Date, required: true},
   });
 
   let actorSchema = mongoose.Schema ({
   Name: {type: String, required: true},
   Bio: {type: String, required: true},
   DateOfBirth: {type: Date, required: true},
   DeathYear: {type: Date, required: true},
   });
   
   let Genre = mongoose.model('Genre', genreSchema);
   let Director = mongoose.model('Director', directorSchema);
   let Actor = mongoose.model('Actor', actorSchema);

   module.exports.Genre = Genre;
   module.exports.Director = Director;
   module.exports.Actor = Actor;
    
    */