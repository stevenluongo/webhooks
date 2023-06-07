import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//create subscription
const handler = async (req, res) => {
  try {
    const reader = await stripe.terminal.readers.processSetupIntent(
      "tmr_FHnrKgxHCpBbLb",
      {
        setup_intent: req.body.setup_intent_id,
        customer_consent_collected: true,
      }
    );

    res.status(201).json({ reader });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
