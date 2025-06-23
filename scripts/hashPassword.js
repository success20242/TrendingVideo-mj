const bcrypt = require("bcryptjs")

const password = "your_desired_admin_password" // Change this to your desired password
const saltRounds = 10

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log("Hashed password for admin:", hash)
})
