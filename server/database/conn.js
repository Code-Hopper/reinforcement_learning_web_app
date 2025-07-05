import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({ path: "./config.env" })

async function conn() {
    try {
        await mongoose.connect(process.env.MONGODBSTRING)
        console.log("database connected successfully !")
    } catch (err) {
        console.log("error while connecting to database : ", err)
    }
}

conn()