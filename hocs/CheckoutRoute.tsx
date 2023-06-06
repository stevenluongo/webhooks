import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Script from "next/script";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function CheckoutRoute(WrappedComponent) {
  return function (...props) {
    return (
      <Elements stripe={stripePromise}>
        <Script src="https://js.stripe.com/terminal/v1/" />
        <WrappedComponent {...props} />
      </Elements>
    );
  };
}

export default CheckoutRoute;
