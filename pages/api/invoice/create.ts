import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//create subscription
const handler = async (req, res) => {
  try {
    const invoice = await stripe.invoices.create({
      customer: "cus_Nbc5y7bXbYLRG5",
      subscription: req.body.subscription_id,
    });
    res.status(201).json({ success: true, invoice });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
