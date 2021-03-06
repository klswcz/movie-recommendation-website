const Rating = require('../models/Rating');
const Movie = require("../models/Movie");
const User = require("../models/User");
const mongoose = require("mongoose");
const tmdb = require('../services/TmdbApi')
const Types = mongoose.Types;

exports.create = (req, res, next) => {
    let promises = []
    User.findOne({email: req.params.token.email}).then(user => {
        Movie.findOne({tmdb_id: req.body.movie_id}).then(movie => {
            if (movie === null) {
                movie = new Movie({
                    movie_id: (new Types.ObjectId).toString(),
                    imdb_id: null,
                    tmdb_id: req.body.movie_id
                })
                promises.push(new Promise((resolve, reject) => {
                    movie.save().then(() => {
                        resolve()
                    })
                }))
            }

            Promise.all(promises).then(() => {
                let ratingModel = new Rating({
                    user_id: user.id,
                    movie_id: movie.movie_id,
                    rating: req.body.rating,
                    timestamp: Date.now()
                })

                ratingModel.save(() => {
                    Rating.find({user_id: user.id}).then(ratings => {
                        return res.send({
                            flashMessageBag: [{msg: 'Rating has been saved.'}],
                            rating: ratingModel.rating,
                            rating_count: ratings.length
                        });
                    })
                })
            })
        })
    })

}

exports.update = (req, res, next) => {
    let promises = []

    User.findOne({email: req.params.token.email}).then(user => {
        Movie.findOne({tmdb_id: req.body.movie_id}).then(movie => {
            if (movie === null) {
                let movieModel = new Movie({
                    movie_id: (new Types.ObjectId).toString(),
                    imdb_id: null,
                    tmdb_id: req.body.movie_id
                })

                promises.push(new Promise((resolve, reject) => {
                    movieModel.save().then(() => {
                        movie = movieModel
                        resolve()
                    })
                }))
            }

            Promise.all(promises).then(() => {
                Rating.findOne({
                    user_id: user.id,
                    movie_id: movie.movie_id
                }).then(rating => {
                    rating.rating = req.body.rating
                    rating.timestamp = Date.now()
                    rating.save(() => {
                        Rating.find({user_id: user.id}).then(ratings => {
                            return res.send({
                                flashMessageBag: [{msg: 'Rating has been updated.'}],
                                rating: rating.rating,
                                rating_count: ratings.length
                            });
                        })
                    })
                })
            })
        })
    })
}

exports.get = (req, res, next) => {
    User.findOne({email: req.params.token.email}).then(user => {
        Movie.findOne({tmdb_id: req.params.movie_id}).then(movie => {
            Rating.findOne({
                user_id: user.id,
                movie_id: movie.movie_id
            }).then(ratingModel => {
                return res.status(200).json({
                    rating: ratingModel ? ratingModel.rating : null
                })
            })
        }).catch((err) => {
            return res.status(400).json({
                messageBag: [{msg: 'Rating was not found.'}]
            });
        })
    })
}

exports.accountRatings = (req, res, next) => {
    User.findOne({email: req.params.token.email}).then(user => {
        Rating.find({user_id: user.id}).then(ratings => {
            let promises = []
            let apiMovies = []
            ratings.forEach(rating => {
                promises.push(new Promise(resolve => {
                        Movie.findOne({movie_id: rating.movie_id}).then(movie => {
                            tmdb.api.get(`/movie/${movie.tmdb_id}?api_key=` + process.env.TMDB_API_KEY).then(apiResponse => {
                                apiResponse.data.user_rating = rating ? rating.rating : null
                                apiMovies.push(apiResponse.data)
                                resolve()
                            })
                        })
                    })
                )
            })
            Promise.all(promises).then(() => {
                return res.status(200).send({
                    ratedMovies: apiMovies
                })
            })

        })
    })
}

exports.destroy = (req, res, next) => {
    User.findOne({email: req.params.token.email}).then(user => {
        Movie.findOne({tmdb_id: req.query.movie_id}).then(movie => {
            Rating.deleteOne({
                user_id: user.id,
                movie_id: movie.movie_id
            }).then(() => {
                Rating.find({user_id: user.id}).then(ratings => {
                    return res.send({
                        flashMessageBag: [{msg: 'Rating has been deleted.'}],
                        rating: null,
                        rating_count: ratings.length
                    });
                })
            })
        }).catch((err) => {
            return res.status(400).json({
                messageBag: [{msg: 'Rating was not found.'}]
            });
        })
    })
}

exports.count = (req, res, next) => {
    User.findOne({email: req.params.token.email}).then(user => {
        Rating.find({user_id: user.id}).then(ratings => {
            return res.send({
                rating_count: ratings.length
            });
        })
    })
}
