'use strict';

const Joi = require('../../lib/joi');
const {fields}= require('../constants/fields');
//Using joi, determing schema for the user object in the body request
const ValidatorSchemaOfBody = Joi.object({
    name:Joi.string().required(),
    continent:Joi.string().required(),
    weight: Joi.number().positive().required(),
    height: Joi.number().required(),
    picture:Joi.string().required(),
    horns:Joi.string().required()
});

const ValidateParams = Joi.object().keys({
    field:Joi.valid(fields).required(),
    value:Joi.string().required()
});
module.exports = {
    ValidatorSchemaOfBody,
    ValidateParams
};