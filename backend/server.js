require("dotenv").config()
const express = require("express")
const session = require("express-session")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth")
const requestRoutes = require("./routes/requests")

const app = express()
app.set("trust proxy", 1);

// ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

// app.use("/api/auth", loginLimiter);

app.use(helmet());
app.use(express.json())

app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL
  ],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "workflow-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 1800000,
    secure: process.env.NODE_ENV === "production"
  }
}))

app.use("/uploads", express.static("uploads"))

app.use("/api/auth", authRoutes)
app.use("/api/requests", requestRoutes)

app.get("/", (req, res) => {
  res.send("College Workflow Backend is Running");
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
