import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//create subscription
const handler = async (req, res) => {
  const { id } = req.query;
  try {
    const invoice = await stripe.invoices.finalizeInvoice(id, {
      auto_advance: false,
    });
    const intent = await stripe.paymentIntents.retrieve(
      invoice.payment_intent as string
    );

    const paymentIntent = await stripe.paymentIntents.update(intent.id, {
      payment_method_types: [...intent.payment_method_types, "card_present"],
    });
    res.status(201).json({ success: true, invoice, paymentIntent });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
