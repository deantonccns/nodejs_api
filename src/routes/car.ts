/** src/routes/car.ts */
import express, { Request, Response, NextFunction} from 'express'
import apis from '../apis/car'
import { carModel, carModelValidator } from '../models/car'

/** middleware */
/** validate x-api-key in headers */
function validateApiKey(req: Request, res: Response, next: NextFunction)
{
    if (!('x-api-key' in req.headers) || req.headers['x-api-key'] !== '1234')
    {
        console.log(`Authentication failed.`);
        return res.status(200).json({
            error: 'Authentication failed.',
            err_code: -1
        });
    }
    next();
}

/** validate the JSON input */
function validateCarSchema(req: Request, res: Response, next: NextFunction)
{
    if (!carModelValidator(req.body))
    {
        console.log('Invalid input arguments: %j', carModelValidator.errors);
        return res.status(200).json({
            error: 'Invalid input arguments.',
            err_code: -2,
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
        console.log(`A car with the id '${carId}' doesn't exist.`);
        return res.status(200).json({
            error: `A car with the id '${carId}' doesn't exist.`,
            err_code: -3
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
        console.log(`A car with the id '${carId}' already exists.`);
        return res.status(200).json({
            error: `A car with the id '${carId}' already exists.`,
            err_code: -4
        });
    }
    next();
}
/** ~middleware */

const router = express.Router();

router.post('/car', validateApiKey, validateCarSchema, ensureCarNotExists, apis.addCar);
router.post('/car_update', validateApiKey, validateCarSchema, ensureCarExists, apis.updateCar);
router.delete('/car/:id', validateApiKey, ensureCarExists, apis.deleteCar);
router.get('/cars', validateApiKey, apis.getCars);
router.get('/car/:id', validateApiKey, apis.getCar);

export = router;
