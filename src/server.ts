/** src/server.ts */

import fs from 'fs'
import http from 'http'
import express, { Express } from 'express'
import mongoose from 'mongoose'
import routes from './routes/car'

const router: Express = express();

/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());


/** Connect to MongoDB, /.dockerenv exists if the app runs in Docker container */
mongoose.connect(
    `mongodb://${fs.existsSync('/.dockerenv')? 'mongo': 'localhost'}:27017/docker-node-mongo`,
    { useNewUrlParser: true }
).then(() => console.log('MongoDB Connected')
).catch(err => console.log(err));

/** Routes to apis*/
router.use('/', routes);

/** Routes to index page which only tells you the server is running */
router.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        message: 'The server is running'
    });
});

/** Error handling */
router.use((req: express.Request, res: express.Response, next) => {
    return res.status(404).json({
        error: 'route not found',
        route: req.originalUrl,
        method: req.method
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
