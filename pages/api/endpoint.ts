import { baseURL } from "@/lib/url";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async (req, res) => {
  try {
    const webhookEndpoint = await stripe.webhookEndpoints.create({
      url: `${baseURL}/webhook/endpoint`,
      enabled_events: ["charge.failed", "charge.succeeded"],
    });
    res.status(201).json({ webhookEndpoint });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
