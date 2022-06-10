require("dotenv").config();
const express = require("express");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./Server/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./DB/db");

const app = express();

app.use(cors());

const port = process.env.PORT | 5000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

const start = async () => {
  try {
    // await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
