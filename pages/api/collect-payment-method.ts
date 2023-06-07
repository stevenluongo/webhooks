import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//register terminal reader
const handler = async (req, res) => {
  try {
    const reader = await stripe.terminal.readers.processSetupIntent(
      "{{READER_ID}}",
      {
        setup_intent: "{{SETUP_INTENT_ID}}",
        customer_consent_collected: true,
      }
    );
    res.status(201).json({ reader });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
