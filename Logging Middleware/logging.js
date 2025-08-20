// logging.js
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjEyMTA1QG5lYy5lZHUuaW4iLCJleHAiOjE3NTU2NzQzNTcsImlhdCI6MTc1NTY3MzQ1NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjBhYzNiNzI2LWIzYzgtNGI5ZC1iNDYxLTU4ZTYwZmZhMDU3ZSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFiaXNoZWlrIHRoYW5nYWJhbGFuIGUiLCJzdWIiOiIxZDE0ZTBhMS1iODNjLTQzN2YtOWU0Yy0wYWZhZDc3ZDdhMjEifSwiZW1haWwiOiIyMjEyMTA1QG5lYy5lZHUuaW4iLCJuYW1lIjoiYWJpc2hlaWsgdGhhbmdhYmFsYW4gZSIsInJvbGxObyI6IjIyMTIxMDUiLCJhY2Nlc3NDb2RlIjoieHNaVFRuIiwiY2xpZW50SUQiOiIxZDE0ZTBhMS1iODNjLTQzN2YtOWU0Yy0wYWZhZDc3ZDdhMjEiLCJjbGllbnRTZWNyZXQiOiJIc3dld0FKQmZUSk1zS3N0In0._v3h_HRf5XWUpCOAI1HRT1v19q0B_2Lb0D5WhqZCnTw";

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

module.exports = { Log };
