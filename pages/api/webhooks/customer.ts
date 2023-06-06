import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const endpointSecret =
  "whsec_13407beb43b949b5c5d5784720742486b2c50b08adfbc9774ac88da7b931c3ee";

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
    case "customer.created":
      const customerCreated = event.data.object;
      console.log(customerCreated);
      console.log("Customer created!");
      break;
    case "customer.deleted":
      const customerDeleted = event.data.object;
      console.log(customerDeleted);
      console.log("Customer deleted!");
      break;
    case "customer.source.created":
      const customerSourceCreated = event.data.object;
      console.log("Customer source created!");
      break;
    case "customer.source.updated":
      const customerSourceUpdated = event.data.object;
      console.log("Customer source updated!");
      break;
    case "customer.updated":
      const customerUpdated = event.data.object;
      console.log(customerUpdated);
      console.log("Customer updated!");
      break;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send({ received: true });
};
