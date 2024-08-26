const mongoose = require('mongoose')

require('dotenv').config({path: '.env'})

// Function to connect to the MongoDB database
const dbConnection = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection string from environment variables
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true, // Use the new URL parser to avoid deprecation warnings
            useUnifiedTopology: true // Use the new Server Discover and Monitoring engine
        });
        console.log('database connected');
    } catch(error){
        console.log(error);
        process.exit(1); // detener app
    }
}

module.exports = dbConnection