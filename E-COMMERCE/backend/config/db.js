const mongoose = require("mongoose");

const connectDB = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected Successfully");
   } catch (err) {
      console.error("MongoDB Connection failed");
      process.exit(1);
   }
}
module.exports = connectDB;