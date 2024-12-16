// should use dotenv config at the top of starting file
import dotenv from 'dotenv';

dotenv.config({
    path:'./env'
})

import databaseConnection from './db/connection.js';
databaseConnection();