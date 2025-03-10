const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');

let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    ReleaseYear: { type: Number},
    Setting: {type: String, required: true},
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        DateOfBirth: Date,
        DeathYear: Date,
    },
    Actors: [{
        ActorsId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor' },
        Name: { type: String, required: true }
    }],
    Image: {
        ImageUrl: { type: String },
        ImageAttribution: { type: String }
    },
    Featured: { type: Boolean, required: false },
});

let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

userSchema.statics.hashPassword = (password) => {
  return bcryptjs.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcryptjs.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

















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