import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//create subscription
const handler = async (req, res) => {
  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(
      req.body.customer_id,
      {
        type: "card",
      }
    );
    res.status(201).json({ paymentMethods });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
