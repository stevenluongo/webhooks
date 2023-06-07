import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//create subscription
const handler = async (req, res) => {
  try {
    const intent = await stripe.setupIntents.create({
      payment_method_types: ["card_present"],
      customer: req.body.customer_id,
    });

    res.status(201).json({ intent });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
