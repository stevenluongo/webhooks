import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//create subscription
const handler = async (req, res) => {
  try {
    const setupIntent = await stripe.setupIntents.retrieve(
      req.body.setup_intent_id,
      {
        expand: ["latest_attempt"],
      }
    );

    res.status(201).json({ setupIntent });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
