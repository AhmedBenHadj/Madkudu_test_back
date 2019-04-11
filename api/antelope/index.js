const express = require('express');
const wrap = require('co-express');
const controller = require('./controller');
const router=  express.Router();

router.post('/addAll',wrap(controller.addAllAntelopes));
router.get('/getAll',wrap(controller.getAllAntelopes));
router.get('/getByCondition',wrap(controller.getByCondition));
router.get('/getWeightByHorns',wrap(controller.getWeight_Horns));
router.get('/getHeightByHorns',wrap(controller.getHeight_Horns));
router.get('/getPercnetageByHorns',wrap(controller.getPercnetageByHorns));
router.get('/getPercentageByContinent',wrap(controller.getPercnetageByContinent));
module.exports = router ;