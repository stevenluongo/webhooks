import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//capture payment intent
const handler = async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.capture(
      req.body.payment_intent_id
    );
    res.status(201).json({ success: true, intent });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
