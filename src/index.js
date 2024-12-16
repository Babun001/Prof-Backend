// should use dotenv config at the top of starting file
import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config({
    path: './env'
})

import databaseConnection from './db/connection.js';
databaseConnection()

try {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on ${process.env.PORT}`);
    })
} catch (error) {
    console.error('Unable to connect Server. ', error);
}