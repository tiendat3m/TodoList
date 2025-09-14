import mongoose from 'mongoose'

export const connecDb = async (params) => {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING)
        console.log('liên kết DB thành công')
    } catch (error) {
        console.error('Lỗi khi liên kết DB:', error)
        process.exit(1)
    }
}
