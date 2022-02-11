/** src/api/car.ts */
import { Request, Response, NextFunction } from 'express'
import { carModel } from '../models/car'


/** insert the car into database with the specific arguments */
const addCar = async (req: Request, res: Response, next: NextFunction) => {
    try
    {
        const newCar = new carModel({
            id: req.body.id,
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
    /** edit the car with the specific arguments */
    try
    {
        const result = await carModel.updateOne(
            { 'id': req.body.id },
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
    /** delete the car from database */
    try
    {
        const result = await carModel.deleteOne({id: req.params.id});
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
        res.status(404).json({error});
    }
};

/** get a specific car */
const getCar = async (req: Request, res: Response, next: NextFunction) => {
    const carId: string = req.params.id;

    try
    {
        const result = await carModel.findOne({id: carId});
        if (result)
        {
            return res.status(200).json(result);
        }
        res.status(404).json({error: `Can't find the car with id: '${carId}'`});
    }
    catch(error)
    {
        res.status(404).json({error});
    };
};

export default { addCar, updateCar, deleteCar, getCars, getCar };
