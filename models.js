const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');


/**
 * Movie schema representing a movie in the database
 * @typedef {Object} Movie
 * @property {string} Title - Movie title
 * @property {number} ReleaseYear - Year the movie was released
 * @property {string} Setting - Location where the movie is set
 * @property {string} Description - Movie description
 * @property {Object} Genre - Genre information
 * @property {Object} Director - Director information
 * @property {Array<ObjectId>} Actors - List of actors
 * @property {boolean} Featured - Whether the movie is featured
 */

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

/**
 * User schema representing an application user in the database
 * @typedef {Object} User
 * @property {string} Username - User's unique username
 * @property {string} Password - User's hashed password
 * @property {string} Email - User's email address
 * @property {Date} DateOfBirth - User's birthday
 * @property {Array<ObjectId>} FavoriteMovies - List of favorited movies by movie IDs
 */

let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

/**
 * Hashes a plaintext password
 * @param {string} password - Plaintext password
 * @returns {string} Hashed password
 */

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
