import express from 'express';
import { json } from 'body-parser';

// connect-redis prefers require syntax, quick trick to play nicely with TS Compiler.
import _RedisStore from 'connect-redis';

import {
   configure
} from './routes';

// Docker env / Local env -> defaults fallthrough
const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

const app = express();

// Allow JSON bodies on POST calls.
app.use(json());

const router = express.Router();
router.use((req, res, next) => {
   // Log each request and timestamp.
   // tslint:disable-next-line: no-console
   console.log(`${req.path}, Time: ${new Date().toUTCString()}`);
   next();
});

// Register server routes
configure(router);

// Add routes to express application
app.use(router);

app.listen(port, () => {
   // Allow nitial log to show server is listening properly.
   // tslint:disable-next-line: no-console
   console.log(`Application listening at http://${host}:${port}`);
});
