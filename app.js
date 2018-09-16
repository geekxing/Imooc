var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc');

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'bower_components')));
app.locals.moment = require('moment');
app.listen(port);

console.log('immoc started on port' + port);


// index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'imooc 首页',
                movies: movies
            })
        }
    })
})

// detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        })
    })
})

// list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        } else {
            res.render('list', {
                title: 'imooc 列表页',
                movies: movies
            })
        }
    })
})

// admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: 'imooc 后台页',
        movie: {
            title:'',
            poster:'',
            doctor: '',
            country: '',
            year: '',
            flash: ''
        }
    })
})

// admin update movie
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('admin', {
            title: 'imooc 后台页',
            movie: movie
        })
    })
})

// admin post movie
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie.id;
    var movieObj = req.body.movie
    var _movie

    if (id !== undefined) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
       _movie = new Movie({
           title:movieObj.title,
           poster:movieObj.poster,
           doctor: movieObj.doctor,
           country: movieObj.country,
           year: movieObj.year,
           flash: movieObj.flash
       })
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }

            res.redirect('/movie/' + movie._id)
        })
    }
})