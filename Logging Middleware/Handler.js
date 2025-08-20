const express = require("express");

const app = express();
app.use(express.json());
const { Log } = require('./logging');




// Routes
app.get("/error", async (req, res) => {
  const result = await Log("backend", "error", "handler", "received string, expected bool");
  res.status(500).json(result); 
});

app.get("/db-error", async (req, res) => {
  const result = await Log("backend", "fatal", "db", "Critical database connection failure.");
  res.status(500).json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


