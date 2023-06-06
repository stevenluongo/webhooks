import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

//register terminal reader
const handler = async (req, res) => {
  try {
    const reader =
      await stripe.testHelpers.terminal.readers.presentPaymentMethod(
        "tmr_FHl1pgYkTqnf36",
        {
          card_present: {
            number: "4000000000000002",
          },
          type: "card_present",
        }
      );
    res.status(201).json({ reader });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export default handler;
