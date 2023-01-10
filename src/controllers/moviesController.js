const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');

const {Movies,Genres,Actor} = require('../database/models');


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id, {
            include: [
                {
                    association: 'genre'
                },
                {
                    association: 'actors'
                }
            ]
        })
            .then(movie => {
                res.render('moviesDetail.ejs', {
                    movie
                });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    },
    add: function (req, res) {
        db.Genre.findAll({
            order: ['name']
        })
            .then(allGenres => {
                return res.render('moviesAdd', {
                    allGenres
                })
            })
            .catch(err => console.log(error));
    },
    create: function (req, res) {
        db.Movie.create({
            ...req.body,
            title: req.body.title.trim()
        })
            .then(newMovie => {
                console.log(newMovie)
                return res.redirect('/movies/detail/' + newMovie.id);
            })
            .catch(error => console.log(error));

    },
    edit: function (req, res) {
        let movie = db.Movie.findByPk(req.params.id);
        let allGenres = db.Genre.findAll({
            order: ['name']
        });
        Promise.all([movie, allGenres])
            .then(([movie, allGenres]) => {
                return res.render('moviesEdit', {
                    Movie: movie,
                    allGenres,
                    moment
                })
            })
            .catch(error => console.log(error));
    },
    update: function (req, res) {
        db.Movie.update(
            {
                ...req.body,
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )
            .then(result => {
                console.log('>>>>>>>>>', result)
                return res.redirect('/movies/detail/' + req.params.id)
            })
            .catch(error => console.log(error));
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                return res.render('moviesDelete', {
                    Movie: movie
                })
            })
            .catch(error => console.log(error));
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(result => {
                console.log('>>>>>>>', result)
                return res.redirect('/movies')
            })
            .catch(error => console.log(error));
    }
}

module.exports = moviesController;