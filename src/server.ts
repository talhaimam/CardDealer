import http from 'http';
import express, { Express } from 'express';
import dealer from './route/dealer';
import { initializeDb } from './controller/data';

const router: Express = express();

/** Logging - Didnt get time to implement logging with Morgan but it was on my personal Agenda */

/** Parse the request */
router.use(express.urlencoded({ extended: false }));

/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
router.use('/', dealer);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not Found');
    return res.status(404).json({
        message: error.message
    });
});

/** Initialize the mongo Database */
initializeDb();

/** Server: localhost:6061 */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6061; 
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}` + '\nEndPoint: localhost:6061'));