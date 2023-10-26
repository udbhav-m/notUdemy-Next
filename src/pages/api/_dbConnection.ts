import mongoose, { ConnectOptions } from "mongoose";

export const connectDB = async () => {
    try {

        mongoose.connect(process.env.MONGODB_URI!, { dbName: 'test' } as ConnectOptions)
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected');
        });

    } catch (e) {
        console.log("something went wrong");
        console.log((e as Error).message);
    }
}