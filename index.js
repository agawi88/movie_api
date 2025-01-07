const express = require("express"),
    morgan = require("morgan");
    fs = require('fs'),
    path = require('path');

const app = express();

app.use(morgan('common'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan("combined", {stream: accessLogStream}));

let topMovies = [
    {
        title: '',
        director: '',
    },
    {
        title: '',
        director: '',
    },
    {
        title: '',
        director: '',
    },
    {
        title: '',
        director: '',
    },
    {
        title: '',
        director: '',
    },
    {
        title: '',
        director: '',
    },
    {
        title: '',
        director: '',
    },
    {
        title: '',
        director: '',
    },
    {
        title: '',
        director: '',
    },
    {
        title: '',
        director: '',
    },
];

app.get('/', (req, res, next) => {
    res.send('Welcome to my movie app myFlix!');
});

app.get('/secreturl', (req, res, next) => {
    res.send('This is a secret url with super top-secret content.')
});

app.get('/documentation.html', express.static('public'));

app.get('/movie', (req, res, next) => {
    res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went awry...');
}); // always  last in a chain of middleware, after all other instances of app.use() and route calls (e.g., after app.get(), app.post(), etc.) but before app.listen()//

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});
