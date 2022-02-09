/** src/api/car.ts */
import { Request, Response, NextFunction } from 'express'
import { carModel, carModelValidtor } from '../models/car'

/** local functions */
async function isCarExists(carId: string): Promise<boolean> {
    const result = await carModel.findOne({id: carId});
    return result? true: false;
}

/** add a new car */
const addCar = async (req: Request, res: Response, next: NextFunction) => {
    /** validate the input arguments */    
    if (!carModelValidtor(req.body))
    {
        return res.status(404).json({
            error: 'Invalid input arguments',
            detail: carModelValidtor.errors
        });
    }

    /** check whether a car with the same id exists */
    const carId: string = req.body.id;
    const isExist: boolean = await isCarExists(carId);
    if (isExist)
    {
        return res.status(404).json({
            error: `A car with the same id exists. id: '${carId}'`,
        });
    }

    /** insert the car into database with the specific arguments */
    try
    {
        const newCar = new carModel({
            id: carId,
            brand: req.body.brand,
            color: req.body.color,
            model: req.body.model,
            capacity: req.body.capacity
        });
        const result = await newCar.save();
        res.status(200).json(result);
    }
    catch (error)
    {
        res.status(404).json({
            error: `Failed to add the car into database`,
            detail: error
        });
    }    
};

/** update a existing car */
const updateCar = async (req: Request, res: Response, next: NextFunction) => {
    /** validate the input arguments */
    if (!carModelValidtor(req.body))
    {
        return res.status(404).json({
            error: 'Invalid input arguments',
            detail: carModelValidtor.errors
        });
    }

    /** check whether the car exists or not*/
    const carId: string = req.body.id;
    const isExist: boolean = await isCarExists(carId);
    if (!isExist)
    {
        return res.status(404).json({
            error: `A car with the id '${carId}' doesn't exist.`,
        });
    }

    /** edit the car with the specific arguments */
    try
    {     
        const result = await carModel.updateOne(
            { "id": carId },
            { $set: req.body }
        );
        res.status(200).json(result);
    }
    catch (error)
    {
        res.status(404).json({
            error: `Failed to update the car into database`,
            detail: error
        });
    }    
};

/** delete a existing car */
const deleteCar = async (req: Request, res: Response, next: NextFunction) => {
    const carId: string = req.params.id;
    /** check whether the car exists or not*/
    const isExist: boolean = await isCarExists(carId);
    if (!isExist)
    {
        return res.status(404).json({
            error: `A car with the id '${carId}' doesn't exist.`,
        });
    }

    /** delete the car from database */
    try
    {
        const result = await carModel.deleteOne({id: carId});
        res.status(200).json(result);
    }
    catch (error)
    {
        res.status(404).json({
            error: `Failed to delete the car from database`,
            detail: error
        });
    }    
};

/** get all cars */
const getCars = async (req: Request, res: Response, next: NextFunction) => {
    try
    {
        const result = await carModel.find({}, {'_id': false, '__v':  false});
        return res.status(200).json(result);
    }
    catch(error)
    {
        res.status(404).json({error: error});
    }
};

/** get a specific car */
const getCar = async (req: Request, res: Response, next: NextFunction) => {
    const carId: string = req.params.id;
    
    try
    {
        const result = await carModel.findOne({id: carId});
        if (result)
            return res.status(200).json(result);
        res.status(404).json({error: `Can't find the car with id: '${carId}'`});
    }
    catch(error)
    {
        res.status(404).json({error: error});
    };
};

export default { addCar, updateCar, deleteCar, getCars, getCar };
