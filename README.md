<h1> # movie_api for # myFlix-client </h1>

<h2>OBJECTIVE</h2>
<p>The objective of this project is to create my own REST API for a movie app called myFlix: British Movies. This project is solely about the server-side component to the movie app.

It consists of a REST API and architected non-relational database built using JavaScript, Node.js, Express, and MongoDB. The REST API will be accessed via commonly used HTTP methods like GET and POST. The CRUD methods will be used to retrieve data from yourthe project's database and store that data in a non-relational way. Finally, the API is deployed using the platform Heroku.

Since the client-side is going to be build using React, both projects when put together in one piece, will apply the tech stack MERN (MongoDB, Express, React, and Node.js).

Essential Features:

● Return a list of ALL movies to the user
● Return data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user
● Return data about a genre (description) by name/title (e.g., “Thriller”)
● Return data about a director (bio, birth year, death year) by name
● Allow new users to register
● Allow users to update their user info (username, password, email, date of birth)
● Allow users to add a movie to their list of favorites
● Allow users to remove a movie from their list of favorites
● Allow existing users to deregister.

Optional Features ( to be introduced in the future):

● Allow users to create a “To Watch” list in addition to their “Favorite Movies” list
● Allow users to see which actors star in which movies
● Allow users to view information about different actors
● Allow users to view more information about different movies, such as movie rating or trailer.

In terms of data security, validation, authorization and authentication, the movie_api applies the following methods:

1. basic HTTP authentication, password hashing and JWT (token-based) authentication
2. validation logic for logging in and updating users.
3. CORS for restricting access.

Please find the link to my movie_api here: https://british-movies-23cb3bbeb9f8.herokuapp.com/
