import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://walteniumroy_db_user:UshDGIgd39crb3Wg@cluster0.q6dj0ps.mongodb.net/MediCare")
    .then(() => {
        console.log("DB CONNECTED")
    })
}
