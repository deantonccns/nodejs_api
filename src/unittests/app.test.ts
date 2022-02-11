import { carModel } from '../models/car'
import fs from 'fs'
import mongoose from 'mongoose'
import supertest from 'supertest'
import express from 'express'
import routes from '../routes/car'

const X_API_KEY :string = '1234';

const MockCars = [
    { id: 'A1000', brand: 'BMW', color: 'red', model: 'X1', capacity: 3300 },
    { id: 'B2000', brand: 'BENZ', color: 'black', model: 'S3', capacity: 1600 },
    { id: 'C3000', brand: 'VW', color: 'white', model: 'Golf', capacity: 2400 },
    { id: 'D4000', brand: 'HONDA', color: 'blue', model: 'CIVIC', capacity: 1200 },
    { id: 'E5000', brand: 'TOYOTA', color: 'yellow', model: 'YARIS', capacity: 1800 },
    { id: 'F5001', brand: 'TESLA', color: 'yellow', model: 'MODEL3', capacity: 0 },
    { id: 'G5002', brand: 'TOYOTA', color: 'brown', model: 'YARIS', capacity: 1800 },
    { id: 'H5003', brand: 'TOYOTA', color: 'sky blue', model: 'YARIS', capacity: 1800 }
];

beforeEach(async() => {
    await mongoose.connect(
        `mongodb://${fs.existsSync('/.dockerenv')? 'mongo': 'localhost'}:27017/docker-node-mongo`,
        { useNewUrlParser: true });
    /** clear all records */
    await mongoose.connection.db.dropDatabase();
    /** add mocking cars before each test */
    await carModel.insertMany(MockCars);
});


afterEach((done) => {
    mongoose.connection.close(() => done());
});

const app = express();
app.use(express.json());
app.use('/', routes);

/** Get all cars. Check the response type and length  */
test('GET /cars', async () => {
    await supertest(app)
        .get('/cars')
        .set({'x-api-key': X_API_KEY})
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(MockCars.length);
        });
});


/** Add a new car. Check the car in the database */
test('POST /car', async () => {
    const newCar = {
        id: 'K8000',
        brand: 'FERRARI',
        color: 'green',
        model: 'F8',
        capacity: 5000
    };

    await supertest(app)
        .post('/car')
        .send(newCar)
        .set({'x-api-key': X_API_KEY})
        .expect(200)
        .then(async (response) => {
            /** verify the response */
            expect(response.body.id).toBe(newCar.id);
            expect(response.body.brand).toBe(newCar.brand);
            expect(response.body.color).toBe(newCar.color);
            expect(response.body.model).toBe(newCar.model);
            expect(response.body.capacity).toBe(newCar.capacity);

            /** verify the data is actually commited */
            const theNewCar = await carModel.findOne({id: newCar.id});
            expect(theNewCar).toBeTruthy();
            if (theNewCar)
            {
                expect(theNewCar.id).toBe(newCar.id);
                expect(theNewCar.brand).toBe(newCar.brand);
                expect(theNewCar.color).toBe(newCar.color);
                expect(theNewCar.model).toBe(newCar.model);
                expect(theNewCar.capacity).toBe(newCar.capacity);
            }
        });
});

/** Update a car. */
test('POST /car_update', async () => {
    const car = {
        id: 'E5000',
        brand: 'MAZDA',
        color: 'blue',
        model: 'CX-3',
        capacity: 1800
    };

    await supertest(app)
        .post('/car_update')
        .send(car)
        .set({'x-api-key': X_API_KEY})
        .expect(200)
        .then(async (response) => {
            /** verify a car is updated */
            expect(response.body.nModified).toBe(1);

            /** verify the car is actually commited */
            const theCar = await carModel.findOne({id: car.id});
            expect(theCar).toBeTruthy();
            if (theCar)
            {
                expect(theCar.id).toBe(car.id);
                expect(theCar.brand).toBe(car.brand);
                expect(theCar.color).toBe(car.color);
                expect(theCar.model).toBe(car.model);
                expect(theCar.capacity).toBe(car.capacity);
            }
        });
});

/** Delete a car. Check the car is removed from the database */
test('DELETE /car/:id', async () => {
    const carId: string = 'A1000';

    await supertest(app)
        .delete(`/car/${carId}`)
        .set({'x-api-key': X_API_KEY})
        .expect(200)
        .then(async (response) => {
            /** verify a car is removed */
            expect(response.body.deletedCount).toBe(1);

            /** verify the car is actually removed from database */
            const theNewCar = await carModel.findOne({id: carId});
            expect(theNewCar).toBeFalsy();
        });
});

/** Add a new car which id exists. */
test('POST /car already exists', async () => {
    const newCar = {
        id: 'H5003',
        brand: 'FERRARI',
        color: 'green',
        model: 'F8',
        capacity: 5000
    };

    await supertest(app)
        .post('/car')
        .send(newCar)
        .set({'x-api-key': X_API_KEY})
        .expect(405);
});

/** Delete a car which doesn't exist */
test('DELETE /car/:id doesn\'t exist', async () => {
    const carId: string = 'A1001';

    await supertest(app)
        .delete(`/car/${carId}`)
        .set({'x-api-key': X_API_KEY})
        .expect(405);
});
