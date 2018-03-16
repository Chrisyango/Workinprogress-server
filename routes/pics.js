'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');

const Pic = require('../models/pic');
const Image = require('../models/image');

/* ========== GET/READ ALL ITEM ========== */
router.get('/pic', (req, res, next) => {
  Pic.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/pic/:id', (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Pic.findOne({_id: id})
    .select('id title src alt likes')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/pic', (req, res, next) => {
  const { title, alt, src, likes, username } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { title, alt, src, likes, username };

  Pic.create(newItem)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;