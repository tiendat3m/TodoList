import mongoose from 'mongoose'

// Cache connection for serverless
let cachedDb = null;

export const connecDb = async () => {
    // If already connected, return cached connection
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }

    try {
        const conn = await mongoose.connect(process.env.DB_CONNECT_STRING);
        cachedDb = conn;
        console.log('liên kết DB thành công');
        return conn;
    } catch (error) {
        console.error('Lỗi khi liên kết DB:', error);
        throw error; // Don't exit in serverless
    }
}
