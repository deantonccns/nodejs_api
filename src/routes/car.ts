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
        return res.status(511).json({
            error: 'Authentication failed.'
        });
    }
    next();
}

/** validate the JSON input */
function validateCarSchema(req: Request, res: Response, next: NextFunction)
{
    if (!carModelValidator(req.body))
    {
        console.log(`Invalid input arguments: ${carModelValidator.errors}`);
        return res.status(400).json({
            error: 'Invalid input arguments.',
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
        return res.status(405).json({
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
        console.log(`A car with the id '${carId}' already exists.`);
        return res.status(405).json({
            error: `A car with the id '${carId}' already exists.`,
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
