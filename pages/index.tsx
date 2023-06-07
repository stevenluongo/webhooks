import CheckoutRoute from "@/hocs/CheckoutRoute";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripeTerminal } from "@stripe/terminal-js";
import { useState } from "react";

const Checkout = () => {
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [setupIntent, setSetupIntent] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const createPaymentIntent = async () => {
    const response = await fetch("/api/intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 1000 }),
    });
    const data = await response.json();
    console.log(data);
    setPaymentIntent(data.paymentIntent);
  };

  const handleCheckout = async () => {
    const { status } = await confirmCardPayment(
      paymentIntent,
      elements,
      stripe
    ); //confirm card payment
    console.log(status);
    console.log("checkout");
  };

  const confirmCardPayment = async (payment_intent, elements, stripe) => {
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      payment_intent.client_secret,
      {
        payment_method: { card: elements.getElement(CardElement) },
      }
    );
    if (error) throw new Error(error.message); //throw errors
    return paymentIntent; //return intent
  };

  const capture = async () => {
    try {
      const payload = { payment_intent_id: paymentIntent.id }; //format payload

      const response = await fetch("/api/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  const processPaymentIntent = async () => {
    const payload = { payment_intent_id: paymentIntent.id }; //format payload

    const response = await fetch("/api/process-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    console.log(data);
  };

  const presentPaymentMethod = async () => {
    const response = await fetch("/api/present-payment-method", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    console.log(data);
  };

  const createSubscription = async () => {
    const response = await fetch("/api/subscription/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customer.id,
        default_payment_method: paymentMethod,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  const createCustomer = async () => {
    const response = await fetch("/api/customer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);

    setCustomer(data.customer);

    const secondRes = await fetch("/api/setup-intent/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer_id: data.customer.id }),
    });
    const secondData = await secondRes.json();
    setSetupIntent(secondData.intent);
    console.log(secondData);

    const thirdRes = await fetch("/api/setup-intent/collect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        setup_intent_id: secondData.intent.id,
      }),
    });

    const thirdData = await thirdRes.json();

    console.log(thirdData);

    // const fourthRes = await fetch("/api/setup-intent/submit", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ setup_intent_id: secondData.setupIntent.id }),
    // });
    // const fourthData = await fourthRes.json();
    // console.log(fourthData);
  };

  const collectPaymentMethod = async () => {
    const response = await fetch("/api/customer/payment-methods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer_id: customer.id }),
    });
    const data = await response.json();
    console.log(data);
    setPaymentMethod(data.paymentMethods.data[0].id);
  };

  return (
    <div>
      <h1>Readers</h1>
      <button onClick={collectPaymentMethod}>Collect Payment Method</button>
      <h1>CUSTOMERS</h1>
      <button onClick={createCustomer}>Create Customer</button>
      <h1>SUBSCRIPTIONS</h1>
      <button onClick={createSubscription}>Create Subscription</button>
      <p>Checkout</p>
      <button onClick={createPaymentIntent}>Create Payment Intent</button>
      <form style={{ width: 250 }}>
        <CardElement />
      </form>
      <button onClick={handleCheckout}>Checkout</button>
      <button onClick={processPaymentIntent}>Process Payment Intent</button>
      <button onClick={presentPaymentMethod}>Present Payment Method</button>
      <button onClick={capture}>Capture</button>
    </div>
  );
};

export default CheckoutRoute(Checkout);
