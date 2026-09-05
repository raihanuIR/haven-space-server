import mongoose from 'mongoose';

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  if (!process.env.MONGO_URI) {
    console.log('[MongoDB Note] Operating with in-memory fallback. Set valid MONGO_URI for persistent database.');
    return false;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
      })
      .then((conn) => {
        console.log(`[MongoDB] Connected: ${conn.connection.host}`);
        return true;
      })
      .catch((error) => {
        cachedPromise = null; // Reset cache so subsequent requests can re-attempt
        console.error(`[MongoDB Error] ${error.message}`);
        console.log('[MongoDB Note] Operating with in-memory fallback.');
        return false;
      });
  }

  return await cachedPromise;
};

export default connectDB;
