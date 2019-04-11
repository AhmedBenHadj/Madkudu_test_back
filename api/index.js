'use strict';
const { Router } = require('express');

const antelopeRoute = require('./antelope')

module.exports = (app)=> {
    const router = Router();
    router.use('/antelopes', antelopeRoute);
    app.use('/api', router);
};
