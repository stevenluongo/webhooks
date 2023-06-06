import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const paymentIntent = await stripe.paymentIntents.update(
      id as string,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Payment Intent Successfully Updated",
      paymentIntent,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
