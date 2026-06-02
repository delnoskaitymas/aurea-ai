const express = require("express");
const path = require("path");
const Stripe = require("stripe");

const app = express();
const PORT = process.env.PORT || 3000;

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const plans = {
  birth: {
    price: process.env.STRIPE_PRICE_ID_BIRTH,
    mode: "payment"
  },
  single: {
    price: process.env.STRIPE_PRICE_ID_SINGLE,
    mode: "payment"
  },
  compatibility: {
    price: process.env.STRIPE_PRICE_ID_COMPATIBILITY,
    mode: "payment"
  },
  premium: {
    price: process.env.STRIPE_PRICE_ID_PREMIUM,
    mode: "payment"
  },
  monthly: {
    price: process.env.STRIPE_PRICE_ID_MONTHLY,
    mode: "subscription"
  }
};

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(400).json({
        error: "Nerastas STRIPE_SECRET_KEY Railway nustatymuose"
      });
    }

    const selectedPlan = plans[plan];

    if (!selectedPlan || !selectedPlan.price) {
      return res.status(400).json({
        error: "Neteisingas planas arba trūksta Stripe Price ID"
      });
    }

    const baseUrl =
      process.env.APP_URL ||
      `http://localhost:${PORT}`;

    const session = await stripe.checkout.sessions.create({
      mode: selectedPlan.mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPlan.price,
          quantity: 1
        }
      ],
      success_url: `${baseUrl}/?success=true&plan=${plan}`,
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

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

app.listen(PORT, () => {
  console.log(`🚀 AUREA AI veikia ant porto ${PORT}`);
});
