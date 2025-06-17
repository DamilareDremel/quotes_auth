import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/authRoutes";
import quoteRoutes from "./routes/quoteRoutes";
import cors from "cors";

dotenv.config();
  // <--- allow CORS on all routes
const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

// Routes
app.use("/auth", authRoutes);
app.use("/quotes", quoteRoutes);

// Start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });


console.log(`
==============================================
🔖 Daily Quote API 🔖
==============================================

API is now running. Available endpoints:

GET    /quotes         - Retrieve all quotes
GET    /quotes/random  - Get a random quote
GET    /quotes/:id     - Get quote by ID
POST   /quotes         - Create a new quote
PUT    /quotes/:id     - Update a quote
DELETE /quotes/:id     - Delete a quote

Authentication required for POST, PUT, DELETE.

Press Ctrl+C to stop the server.
==============================================
`);
