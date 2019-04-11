const createError = require('http-errors');
const http = require('http');
const express = require('express');
const co = require('co');
const path = require('path');
const logger = require('chpr-logger');
const { configure } = require('./config/express');
const config = require('./config');

var mongoose = require('mongoose');
const url = config.mongodb.url;

let app;
let server;

//Connection the database
mongoose.connect(url,{useNewUrlParser: true});

const mongo=mongoose.connection;

mongo.on('connected',()=>{

    console.log('initialisation');


});
mongo.on('open',()=>{
    console.log('connexion etablie');

});

mongo.on('error',(err)=>{
    console.log(err);
});

/**
 * Start the web app.
 *
 * @returns {Promise} when app end to start
 */
async function start() {
    if (app) {
        return app;
    }
    logger.info('Express web server creation');
    app = configure(express());
    server = http.createServer(app);
    await server.listen(app.get('port'));

    logger.info(
        {
            port: server.address().port,
            environment: process.env.NODE_ENV,
        },
        '✔ Server running',
    );

    return app;
}

/**
 * Stop the web app.
 *
 * @returns {Promise} when app end to start
 */
async function stop() {
    if (server) {
        await server.close();
        server = null;
        app = null;
    }
    await mongoose.disconnect();
    return Promise.resolve();
}

if (!module.parent) {
    co(start);
}

module.exports = {
    start,
    stop,
    get server() {
        return server;
    },
    get app() {
        return app;
    },
};