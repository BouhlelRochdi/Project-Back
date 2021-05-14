const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/project", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("==>Successfully connect to DataBase."))
  .catch(err => console.error("==>Connection error", err));