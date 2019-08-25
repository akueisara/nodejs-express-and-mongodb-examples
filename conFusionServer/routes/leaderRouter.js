const express = require('express');
const bodyParser = require('body-parser');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then((leaders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Leaders.create(req.body)
            .then((leader) => {
                console.log('Leader Created ', leader);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res) => {
        req.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res) => {
        Leaders.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then((leader) => {
                if (leader != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leader);
                } else {
                    err = new Error('Leader ' + req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res) => {
        req.statusCode = 403;
        res.end('POST operation not supported on /leaders/' + req.params.leaderId);
    })
    .put((req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, {new: true})
            .then((leader) => {
                if (leader != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leader);
                } else {
                    err = new Error('Leader ' + req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                if(resp != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                } else {
                    err = new Error('Leader ' + req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = leaderRouter;