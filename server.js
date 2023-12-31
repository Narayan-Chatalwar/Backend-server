const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

//dbconnect
connectDb();

const app = express();

const port = process.env.PORT || 5004;

//middlewares
app.use(express.json());

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

// app listening on port

app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});
