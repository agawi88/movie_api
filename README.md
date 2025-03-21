<h1> # movie_api for # myFlix-client </h1>

<h2>OBJECTIVE</h2>
<p>The objective of this project is to create my own REST API for a movie app called myFlix: British Movies. This project is solely about the server-side component to the movie app.

It consists of a REST API and architected non-relational database built using JavaScript, Node.js, Express, and MongoDB. The REST API will be accessed via commonly used HTTP methods like GET and POST. The CRUD methods will be used to retrieve data from yourthe project's database and store that data in a non-relational way. Finally, the API is deployed using the platform Heroku.

Since the client-side is going to be build using React, both projects when put together in one piece, will apply the tech stack MERN (MongoDB, Express, React, and Node.js).

<h2>Essential Features:</h2>
<ul>
<li>Return a list of ALL movies to the user</li>
<li>Return data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user  </li>
<li>Return data about a genre (description) by name/title (e.g., “Thriller”)</li>
<li>Return data about a director (bio, birth year, death year) by name </li>
<li>Allow new users to register</li>
<li>Allow users to update their user info (username, password, email, date of birth) </li>
<li>Allow users to add a movie to their list of favorites </li>
<li>Allow users to remove a movie from their list of favorites </li>
<li>Allow existing users to deregister. </li>
</ul>
<h2>Optional Features ( to be introduced in the future):</h2>
<ul>
<li>Allow users to create a “To Watch” list in addition to their “Favorite Movies” list</li>
<li> Allow users to see which actors star in which movies </li>
<li> Allow users to view information about different actors </li>
<li> Allow users to view more information about different movies, such as movie rating or trailer. </li>
</ul>

<h2>In terms of data security, validation, authorization and authentication, the movie_api applies the following methods: </h2>
<ul>
<li> Basic HTTP authentication, password hashing and JWT (token-based) authentication </li>
<li> Validation logic for logging in and updating users. </li>
<li> CORS for restricting access. </li>

<h2> Please find the link to my movie_api here: https://british-movies-23cb3bbeb9f8.herokuapp.com/ </h2>
