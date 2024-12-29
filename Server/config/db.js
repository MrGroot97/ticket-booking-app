import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("BookMyShow MongoDB connected");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

export default connectDB;