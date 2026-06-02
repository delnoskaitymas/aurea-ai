const express = require("express");
const path = require("path");
const Stripe = require("stripe");

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe inicializacija
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Stripe Checkout
app.post("/create-checkout-session", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(400).json({
        error: "Nerastas STRIPE_SECRET_KEY Railway nustatymuose"
      });
    }

    if (!process.env.STRIPE_PRICE_ID) {
      return res.status(400).json({
        error: "Nerastas STRIPE_PRICE_ID Railway nustatymuose"
      });
    }

    const baseUrl =
      process.env.APP_URL ||
      `http://localhost:${PORT}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],

      success_url: `${baseUrl}/?success=true`,
      cancel_url: `${baseUrl}/?canceled=true`
    });

    return res.json({
      url: session.url
    });

  } catch (error) {
    console.error("Stripe klaida:", error);

    return res.status(500).json({
      error: error.message
    });
  }
});

// Visus puslapius grąžina į index.html
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

// Serverio paleidimas
app.listen(PORT, () => {
  console.log(`🚀 AUREA AI veikia ant porto ${PORT}`);
});
