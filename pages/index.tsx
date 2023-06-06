import CheckoutRoute from "@/hocs/CheckoutRoute";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const Checkout = () => {
  const [paymentIntent, setPaymentIntent] = useState(null);
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

  return (
    <div>
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
