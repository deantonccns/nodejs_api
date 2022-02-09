/** src/routes/car.ts */
import express, { Request, Response, NextFunction} from 'express'
import apis from '../apis/car'
import { carModel, carModelValidator } from '../models/car'

/** middleware */
/** validate the JSON input */
function validateCarSchema(req: Request, res: Response, next: NextFunction)
{
    if (!carModelValidator(req.body))
    {
        return res.status(404).json({
            error: 'Invalid input arguments',
            detail: carModelValidator.errors
        });
    }
    next();
}

/** ensure the car with the given id exists, otherwise return error */
async function ensureCarExists(req: Request, res: Response, next: NextFunction) {
    const carId: string = req.body.id ?? req.params.id; /** id can be either from req.body or req.params */
    const result = await carModel.findOne({id: carId});
    if (!result)
    {
        return res.status(404).json({
            error: `A car with the id '${carId}' doesn't exist.`,
        });
    }
    next();
}

/** ensure the car with the given id does not exist, otherwise return error */
async function ensureCarNotExists(req: Request, res: Response, next: NextFunction) {
    const carId: string = req.body.id ?? req.params.id; /** id can be either from req.body or req.params */
    const result = await carModel.findOne({id: carId});
    if (result)
    {
        return res.status(404).json({
            error: `A car with the id '${carId}' already exists.`,
        });
    }
    next();
}
/** ~middleware */

const router = express.Router();

router.post('/car', validateCarSchema, ensureCarNotExists, apis.addCar);
router.post('/car_update', validateCarSchema, ensureCarExists, apis.updateCar);
router.delete('/car/:id', ensureCarExists, apis.deleteCar);
router.get('/cars', apis.getCars);
router.get('/car/:id', apis.getCar);

export = router;
