const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");

let Log;
try {
  ({ Log } = require("../Logging Middleware/logging"));
} catch {
  Log = async (...args) => console.log("[LOG]", ...args);
}

const app = express();
app.use(bodyParser.json());

const PORT = 3001;
const HOSTNAME = `http://localhost:${PORT}`;

const urlStore = {}; 


function generateShortcode() {
  return Math.random().toString(36).substring(2, 8);
}

function isValidURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}


app.post("/shorturls", authenticate, async (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url || !isValidURL(url)) {
    await Log("backend", "error", "shortener", "Invalid URL provided");
    return res.status(400).json({ error: "Invalid URL format" });
  }

  let code = shortcode || generateShortcode();
  if (urlStore[code]) {
    return res.status(409).json({ error: "Shortcode already in use" });
  }

  const duration = validity && Number.isInteger(validity) ? validity : 30; // minutes
  const expiry = new Date(Date.now() + duration * 60 * 1000);

  urlStore[code] = {
    longUrl: url,
    expiry,
    createdAt: new Date(),
    clicks: 0,
    stats: [],
  };

  await Log("backend", "info", "shortener", `Short URL created: ${code}`);

  res.status(201).json({
    shortLink: `${HOSTNAME}/r/${code}`,
    expiry: expiry.toISOString(),
  });
});

app.get("/r/:code", async (req, res) => {
  const { code } = req.params;
  const record = urlStore[code];

  if (!record) {
    await Log("backend", "error", "redirect", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  if (new Date() > record.expiry) {
    return res.status(410).json({ error: "Link expired" });
  }

  record.clicks += 1;
  record.stats.push({
    timestamp: new Date(),
    referrer: req.get("referer") || "direct",
    ip: req.ip,
  });

  res.redirect(record.longUrl);
});

app.get("/shorturls/:code/stats", authenticate, (req, res) => {
  const { code } = req.params;
  const record = urlStore[code];

  if (!record) {
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json({
    shortLink: `${HOSTNAME}/r/${code}`,
    longUrl: record.longUrl,
    createdAt: record.createdAt,
    expiry: record.expiry,
    clicks: record.clicks,
    stats: record.stats,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at ${HOSTNAME}`);
});
