import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//create subscription
const handler = async (req, res) => {
  try {
    console.log(req.body);
    const subscription = await stripe.subscriptions.create({
      default_payment_method: req.body.default_payment_method,
      customer: req.body.customer_id,
      items: [{ price: "price_1NFRV1BrLIsk6wkGPKMvSm86" }],
    });
    res.status(201).json({ success: true, subscription });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
