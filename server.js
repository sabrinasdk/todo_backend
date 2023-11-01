const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/submit-form", (req, res) => {
  const formData = req.body;
  // Handle the submitted form data, e.g., save it to a database.
  console.log(formData.nom);
  res.json({ message: "Form data received successfullaaay" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
const { Pool } = require("pg");

const pool = new Pool({
  user: "qvpcbtbb",
  host: "bubble.db.elephantsql.com",
  database: "qvpcbtbb",
  password: "InubxDuQZ1hQGFpKJnmto767w7eZypll",
  port: 5432, // Default PostgreSQL port
});
*/
