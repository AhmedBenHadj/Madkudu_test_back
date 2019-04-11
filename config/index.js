'use strict';

module.exports = {
    port: process.env.PORT || 3100,
    mongodb: {
        name: 'medgo',
        url: process.env.MONGO_URL || 'mongodb://localhost:27017/madkudu',
        options: {},
    },
};
