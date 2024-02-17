"strict mode";

const express = require('express')
const app = express()
require("dotenv").config();
const port = process.env.PORT

app.use(express.json());

app.use("/", require("./routes/ping"));
app.use("/", require("./routes/login"));
app.use("/", require("./routes/signup"));
app.use("/", require("./routes/createTable"));
app.use("/", require("./routes/wildCard"));

app.listen(port, () => {
  console.log(`Invoice Management Server listening on port ${port}`)
})