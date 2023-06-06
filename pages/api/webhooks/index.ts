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

export default async (request: NextApiRequest, response) => {
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
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    case "payment_intent.created":
      const paymentIntentCreated = event.data.object;
      if (response.socket.server.io) {
        const io = response.socket.server.io;
        io.sockets.emit("update-input", "Hello World");
      }
      console.log("Payment intent created!");
      // Then define and call a function to handle the event payment_intent.created
      break;
    case "payment_intent.amount_capturable_updated":
      const paymentIntentAmountCapturableUpdated = event.data.object;
      console.log(
        "Amount capturable: ",
        paymentIntentAmountCapturableUpdated.amount_capturable
      );
      // Then define and call a function to handle the event payment_intent.amount_capturable_updated
      break;
    case "charge.succeeded":
      const chargeSucceeded = event.data.object;
      if (!chargeSucceeded.captured) {
        console.log("Charge not captured");
        break;
      }
      console.log("Charge succeeded!");
      // Then define and call a function to handle the event charge.succeeded
      break;
    case "charge.captured":
      const chargeCaptured = event.data.object;
      console.log("Charge succeeded!");
      // Then define and call a function to handle the event charge.captured
      break;

    case "payment_intent.payment_failed":
      const paymentIntentPaymentFailed = event.data.object;
      console.log("Payment failed!");
      // Then define and call a function to handle the event payment_intent.payment_failed
      break;
    case "charge.failed":
      const chargeFailed = event.data.object;
      console.log("Charge failed!");
      // Then define and call a function to handle the event charge.failed
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send({ received: true });
};
