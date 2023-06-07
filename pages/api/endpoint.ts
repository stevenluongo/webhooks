import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const endpointSecret = "whsec_t9L9pQgR3X1rxyPRycRHpOGuWmcfBwF0";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method Not Allowed");
    return;
  }
  const buf = await buffer(request);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "terminal.reader.action_succeeded":
      const succeeded = event.data.object;
      console.log("Terminal Reader Action Succeeded!");
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    case "terminal.reader.action_failed":
      const failed = event.data.object;
      console.log("Payment intent failed!");
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send({ received: true });
};
