/** src/routes/car.ts */
import express from 'express'
import apis from '../apis/car'

const router = express.Router();

router.post('/car', apis.addCar);
router.post('/car_update', apis.updateCar);
router.delete('/car/:id', apis.deleteCar);
router.get('/cars', apis.getCars);
router.get('/car/:id', apis.getCar);

export = router;
