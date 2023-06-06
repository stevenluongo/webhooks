import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: "usd",
    capture_method: "manual",
    payment_method_types: ["card_present"],
  });

  response.status(201).json({ paymentIntent });
};
