const express = require("express");

const app = express();
app.use(express.json());

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjEyMTA1QG5lYy5lZHUuaW4iLCJleHAiOjE3NTU2NzE4ODUsImlhdCI6MTc1NTY3MDk4NSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjI2ZmI5N2U0LTY2MzAtNGZiZC1iMDk1LWI3ZWRiYTA3N2M2YyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFiaXNoZWlrIHRoYW5nYWJhbGFuIGUiLCJzdWIiOiIxZDE0ZTBhMS1iODNjLTQzN2YtOWU0Yy0wYWZhZDc3ZDdhMjEifSwiZW1haWwiOiIyMjEyMTA1QG5lYy5lZHUuaW4iLCJuYW1lIjoiYWJpc2hlaWsgdGhhbmdhYmFsYW4gZSIsInJvbGxObyI6IjIyMTIxMDUiLCJhY2Nlc3NDb2RlIjoieHNaVFRuIiwiY2xpZW50SUQiOiIxZDE0ZTBhMS1iODNjLTQzN2YtOWU0Yy0wYWZhZDc3ZDdhMjEiLCJjbGllbnRTZWNyZXQiOiJIc3dld0FKQmZUSk1zS3N0In0.MhVcAG7Y5wGvN_jjaftXI3IoQ57T4Rkh_c6kUzV1YvA";

async function Log(stack, level, pkg, message) {
  try {
    const logData = {
      stack: stack,
      level: level,
      package: pkg,
      message: message
    };

    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`   
      },
      body: JSON.stringify(logData)
    });

    const result = await response.json();  // ✅ parse API response
    console.log("Log API Response:", result);

    return result; // ✅ return it so routes can use it
  } catch (err) {
    console.error("Failed to send log:", err);
    return { error: "Failed to send log" }; // return error response
  }
}

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
