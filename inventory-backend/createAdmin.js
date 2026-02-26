const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB Connected");

    // delete old admin (plain password)
    await User.deleteOne({ email: "admin@gmail.com" });

    // hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // create new admin
    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    console.log("Admin recreated with HASHED password");
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });