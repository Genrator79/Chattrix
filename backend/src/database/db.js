import mongoose from "mongoose"

export const connectToDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected Successfully!!!");
    }
    catch(error){
        console.log("Error connecting MongoDB!!!")
        console.log(error)
        process.exit(1);
    }
}