const express = require('express');
const bodyParser = require('body-parser');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Promotions.create(req.body)
            .then((promotion) => {
                console.log('Promotion Created ', promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res) => {
        req.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res) => {
        Promotions.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then((promotion) => {
                if (promotion != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion);
                } else {
                    err = new Error('Promotion ' + req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res) => {
        req.statusCode = 403;
        res.end('POST operation not supported on /promotions/' + req.params.promoId);
    })
    .put((req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, {new: true})
            .then((promotion) => {
                if (promotion != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promotion);
                } else {
                    err = new Error('Promotion ' + req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then((promotion) => {
                if (promotion != null) {
                    promotion.remove();
                    promotion.save()
                        .then((promotion) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(promotion);
                        }, (err) => next(err));
                } else {
                    err = new Error('Promotion ' + req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = promoRouter;