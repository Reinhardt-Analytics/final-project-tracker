// server.js
import express from "express";
import dotenv from "dotenv";
import { Client, Environment } from "square";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Square client
const client = new Client({
  environment:
    process.env.SQUARE_ENVIRONMENT === "sandbox"
      ? Environment.Sandbox
      : Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

// Simple health check route
app.get("/", (req, res) => {
  res.send("✅ Budget Tracker API running...");
});

/**
 * Route: /api/square/create-card
 * Purpose: Receives a payment nonce from the front-end,
 * then creates a stored card on file via Square API.
 */
app.post("/api/square/create-card", async (req, res) => {
  const { nonce } = req.body;

  if (!nonce) {
    return res.status(400).json({ success: false, message: "Missing nonce" });
  }

  try {
    // Step 1: create or reuse a Square Customer (you could store this ID in a DB)
    const customersApi = client.customersApi;
    const customerRes = await customersApi.createCustomer({
      idempotencyKey: crypto.randomUUID(),
      givenName: "Demo",
      familyName: "User",
      emailAddress: "demo@example.com",
    });

    const customerId = customerRes.result.customer.id;

    // Step 2: attach card-on-file to that customer
    const cardsApi = client.cardsApi;
    const cardRes = await cardsApi.createCard({
      idempotencyKey: crypto.randomUUID(),
      sourceId: nonce,
      card: {
        customerId,
      },
    });

    res.json({
      success: true,
      message: "Card linked successfully!",
      cardId: cardRes.result.card.id,
    });
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create card",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
