const Joi = require('../lib/joi');
const mongoose = require('mongoose');

//The collection name in the DATABASE
const COLLECTION_NAME = 'antelopes' ;


//The mongooseSchema
const antelopeSchema =  mongoose.Schema({
    name:String,
    continent:String,
    weight:Number,
    height:Number,
    horns:String,
    picture:String,
});


//The Joi antelope Schema
const joiAntelopeSchema = Joi.object({
    _id:Joi.objectId(),
    name:Joi.string().required(),
    continent:Joi.string().required(),
    weight: Joi.number().positive().required(),
    height: Joi.number().required(),
    picture:Joi.string().required(),
    horns:Joi.string().required()
});

/**
 * validate schema of a antelope
 *
 * @param {Object} antelope to be validate
 *
 * @returns {Object} response
 */
function _validateSchema(antelope) {
    return Joi.attempt(antelope,joiAntelopeSchema);
}

/**
 * get the collection from the database
 *
 * @returns {Object} response
 */
function collection(){
    return mongoose.model(COLLECTION_NAME,antelopeSchema) ;
}

/**
 * Validate antelope Schema and add that object to the database
 *
 * @param {Object} antelope - data about the inserted antelope
 *
 * @returns {Object} the inserted antelope
 */
async function insertOne(antelope){
    const antelope_validate = _validateSchema(antelope);
    if(antelope_validate){
        const antelope_returned = await collection().insertMany(antelope_validate);
        return antelope_returned ;
    }
    return null;
}

/**
 * Returns a cursor on lots for a given query.
 *
 * @param {object} query       - mongo query
 * @param {object} projections - optional projection of results fields
 *
 * @returns {Promise<Cursor>} The cursor to iterate on messages
 */
function find(query = {}, projections = {}) {
    return collection().find(query, projections);
}

/**
 * Returns a cursor on lots for a given query.
 *
 * @param {object} query       - mongo query
 *
 * @returns {Promise<Cursor>} The cursor to iterate on messages
 */
function aggregate(query=[{}]){
    return collection().aggregate(query);
}

/**
 * Returns a cursor on lots for a given query.
 *
 * @param {String} value       - the value of the average
 * @param {String} searchedValue       - the searchedValue
 * @param {String} name       - the match name
 *
 * @returns {Promise<Cursor>} The cursor to iterate on messages
 */
function getAvgByHorns(value,searchedValue="$weight",name="horns"){
    return collection().aggregate([
        {
            $match:{[name]:value}
        },
        {
            $group:{
                _id:null,
                avg:{$avg:searchedValue}
            }
        }
    ])
}

/**
 * Returns a cursor on lots for a given query.
 *
 * @param {String} field - the field for the percentage
 *
 * @returns {Promise<Cursor>} The cursor to iterate on messages
 */
async function getPercentage(field){
    const totalAntelopes = await collection().countDocuments();
    return collection().aggregate([
        {
            $group:{
                _id:{type:field},
                count:{$sum:1}
            }
        },
        {
            $project:{
                count:1,
                percentage:{
                    $multiply:[
                        {$divide:[100,totalAntelopes]},
                        "$count"
                    ]
                }
            }
        }
    ]);
}


module.exports = {
    insertOne,
    find,
    aggregate,
    getAvgByHorns,
    getPercentage
};