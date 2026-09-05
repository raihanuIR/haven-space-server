import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  if (!process.env.MONGO_URI) {
    console.log('[MongoDB Note] Operating with in-memory fallback. Set valid MONGO_URI for persistent database.');
    return false;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Error] ${error.message}`);
    console.log('[MongoDB Note] Operating with in-memory fallback.');
    return false;
  }
};

export default connectDB;
