// scripts/hashPassword.js
const bcrypt = require("bcryptjs")

const password = "yourpassword"
const saltRounds = 10

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log("Hashed password:", hash)
})
