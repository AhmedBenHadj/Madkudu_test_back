const Joi = require('../../lib/joi');
const antelopes = require('../../models/antelopes');
const ParamsSchema = require('./schema').ValidateParams;
const request = require('request');
const {horns} = require('../constants/horns') ;

/**
 * Check the body of the request and add the antelopes to the database
 *
 * @param {Object,Object} req,res - request and the result
 */
function addAllAntelopes(req,res){
    let _antelopes = [] ;
    request('https://s3-us-west-2.amazonaws.com/team.madkudu.com/species.json',async (error,response,body)=>{
        if(error){
            res.status(404).send("An error has occured! is your internet connexion working ?") ;
        }
        if(body){
            _antelopes = JSON.parse(body) ;
            console.log("Adding antelopes from external website");
            for(let i=0;i<_antelopes.length;i++){
                const returnedAntelope = await antelopes.insertOne(_antelopes[i]);
                console.log(returnedAntelope,' Added!');
            }
            res.status(200).send(_antelopes);
        }
    });
}

/**
 * Access to the database and return all antelopes
 * If database is not empty return successful res, else return error
 *
 * @param {Object,Object} req,res - request and the result
 */
async function getAllAntelopes(req,res){
    const _antelopes = await antelopes.find({});
    if(_antelopes){
        res.status(200).send(_antelopes);
    }
    res.status(404).send("Database is empty");
}

/**
 * Get and antelope from database with a condition sent in the URL
 * if the params are not correct, send error message
 * if params are correct, send the wanted antelope
 *
 * @param {Object,Object} req,res - request and the result
 */
async function getByCondition(req,res){
    const params = req.query.array ;
    if(params){
        const jsonObject = JSON.parse(params);
        let query = {};
        for(let i=0;i<jsonObject.length;i++){
            const {error,value:verified_value} = Joi.validate(jsonObject[i],ParamsSchema);
            if(error){
                res.status(405).send("invalid request!");
                return ;
            }
            if(verified_value){
                const field = verified_value.field ;
                const value = verified_value.value ;
                query[field] = value ;
            }
        }
        const result = await antelopes.find(query);
        res.status(200).send(result) ;
        return ;
    }
    res.status(404).send("No result!");
}

/**
 * Get the average of each type of horns from the database
 * Return a list of JsonObject  of each hornName and the averageWeight
 *
 * @param {Object,Object} req,res - request and the result
 */
async function getWeight_Horns(req,res){
    let arrayJsonObject = [] ;
    for(let i=0;i<horns.length;i++){
        const response = await antelopes.getAvgByHorns(horns[i]);
        const jsonObject = {
            name:horns[i],
            weight:response[0].avg
        };
        arrayJsonObject.push(jsonObject);
    }
    if(arrayJsonObject){
        res.status(200).send(arrayJsonObject);
        return ;
    }
    res.status(404).send("Database is empty!");
}

/**
 * Get the average of each type of horns from the database
 * Return a list of JsonObject  of each hornName and the averageHeight
 *
 * @param {Object,Object} req,res - request and the result
 */
async function getHeight_Horns(req,res){
    let arrayJsonObject = [] ;
    for(let i=0;i<horns.length;i++){
        const response = await antelopes.getAvgByHorns(horns[i],"$height");
        const jsonObject = {
            name:horns[i],
            height:response[0].avg
        };
        arrayJsonObject.push(jsonObject);
    }
    if(arrayJsonObject){
        res.status(200).send(arrayJsonObject);
        return ;
    }
    res.status(404).send("Database is empty!");
}

/**
 * Get the percentage of antelope with each type of horns
 *
 * @param {Object,Object} req,res - request and the result
 */
async function getPercnetageByHorns(req,res){
    res.send(await antelopes.getPercentage("$horns"));
}

/**
 * Get the percentage of antelope with each type of continent
 *
 * @param {Object,Object} req,res - request and the result
 */
async function getPercnetageByContinent(req,res){
    res.send(await antelopes.getPercentage("$continent"));
}

module.exports = {
    addAllAntelopes,
    getAllAntelopes,
    getByCondition,
    getWeight_Horns,
    getHeight_Horns,
    getPercnetageByHorns,
    getPercnetageByContinent
};
