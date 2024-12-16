import mongoose from "mongoose";
import {dbName} from "../constants.js"
const databaseConnection = async() =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.connectionLink}/${dbName}`)
        console.log(`Database Connected!! || Hosted At ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error(`Error at connection.js || ERROR : ${error}`);
        process.exit(1);        
    }
}

export default databaseConnection;