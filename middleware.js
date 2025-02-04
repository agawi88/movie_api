const validateQueryParams = (req, res, next) => {
    const { Username, FavoriteMovies, MovieID } = req.query;

    if (!Username || !FavoriteMovies || !MovieID) {
        return res.status(400).send('Missing Username, FavoriteMovies or MovieID');
    }

    next();
};

module.exports = validateQueryParams;