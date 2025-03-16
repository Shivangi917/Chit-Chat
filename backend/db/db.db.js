const mongoose = require('mongoose');

const connectDB = async () => {
    const DB_NAME="chai-ai"
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MONGODB connected !! DB HOST: ${connectionInstance}`);
    } catch (error) {
        console.log("MONGODB connection error: ", error);
        process.exit(1);
    }
}

module.exports = connectDB;