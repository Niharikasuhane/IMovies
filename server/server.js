require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Imovies";

// Connect to MongoDB database
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start listening once DB is connected
    app.listen(PORT, () => {
      console.log(`iMovies backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Still start server so app doesn't crash completely, but log error
    app.listen(PORT, () => {
      console.log(`iMovies backend running at http://localhost:${PORT} (offline DB mode)`);
    });
  });
