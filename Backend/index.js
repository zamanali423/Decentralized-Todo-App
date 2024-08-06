require("dotenv").config();
const express = require("express");
const port = process.env.PORT;
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./router/users/users");
const itemsRouter = require("./router/items/itemsRouter");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/auth/users", userRouter);
app.use("/items", itemsRouter);

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("Databse connected successfully");
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
