const mongoose = require('mongoose')

require('dotenv').config({path: '.env'})

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('database connected');
    } catch(error){
        console.log(error);
        process.exit(1); // detener app
    }
}

module.exports = dbConnection