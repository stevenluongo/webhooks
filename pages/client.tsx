import CheckoutRoute from "@/hocs/CheckoutRoute";
import { loadStripeTerminal } from "@stripe/terminal-js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Checkout = () => {
  const [setupIntent, setSetupIntent] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [terminal, setTerminal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      const terminal = await initTerminal();
      setTerminal(terminal);
      const readers = await discoverReaderHandler(terminal);
      await connectReaderHandler(readers, terminal);
      setIsLoading(false);
    };
    loadApp();
  }, []);

  const createCustomerHandler = async () => {
    const response = await createCustomer();
    toast.success("Customer created");
    setCustomer(response.customer);
  };

  const createSetupIntentHandler = async () => {
    const response = await createSetupIntent(customer.id);
    toast.success("Setup Intent created");
    setSetupIntent(response.intent);
  };

  const collectSetupIntentPaymentMethodHandler = async () => {
    // clientSecret is the client_secret from the SetupIntent you created in Step 1.
    const result = await terminal.collectSetupIntentPaymentMethod(
      setupIntent.client_secret,
      true
    );
    if (result.error) {
      toast.error(result.error.message);
    } else {
      const res = await terminal.confirmSetupIntent(result.setupIntent);
      console.log(res);
      setPaymentMethod(
        res.setupIntent.latest_attempt.payment_method_details.card_present
          .generated_card
      );
    }
  };

  const createSubscriptionHandler = async () => {
    const response = await createSubscription(customer.id, paymentMethod);
    console.log(response);
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <h1>HELLO</h1>
      <h1>Customer</h1>
      <button onClick={createCustomerHandler}>Create Customer</button>
      <h1>Setup Intent</h1>
      <button onClick={createSetupIntentHandler}>Create Setup Intent</button>
      <button onClick={collectSetupIntentPaymentMethodHandler}>
        Collect Payment Method
      </button>
      <h1>Subscription</h1>
      <button onClick={createSubscriptionHandler}>Create Subscription</button>
    </div>
  );
};

export default CheckoutRoute(Checkout);

//initializes a new stripe terminal
const initTerminal = async () => {
  const StripeTerminal = await loadStripeTerminal();

  //create a new terminal session
  const temp = StripeTerminal.create({
    onFetchConnectionToken: async () => {
      const response = await fetch("/api/connection-token");
      const data = await response.json();
      return data.secret;
    },
    onUnexpectedReaderDisconnect: async () => {
      console.log("Reader disconnected");
    },
  });

  toast.success("Terminal initialized");

  return temp;
};

//finds discovered terminal readers
const discoverReaderHandler = async (temp) => {
  const result = await temp.discoverReaders(); //discover card readers
  //if error
  if (result.error) {
    //display feedback
    toast.error(result.error.message);
  }
  //if no available readers
  else if (result.discoveredReaders.length === 0) {
    //display feedback
    toast.error("No readers available. Please try again.");
  }
  //success!
  else {
    //display feedback
    toast.success("Readers discovered!");
    return result.discoveredReaders;
  }
};

//connect to terminal reader
const connectReaderHandler = async (readers, temp) => {
  try {
    //throw error if no discovered readers
    if (!readers)
      throw new Error(
        "No readers available. Please make sure you discover a card reader."
      );

    const selectedReader = readers[0]; //select first reader in array

    const result = await temp.connectReader(selectedReader); //connect to reader

    //throw errors
    if (result.error) throw new Error(result.error.message);
    toast.success("Reader connected!");
  } catch (e) {
    toast.error(e.message);
  }
};

const createCustomer = async () => {
  const response = await fetch("/api/customer/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

const createSetupIntent = async (customer_id) => {
  const response = await fetch("/api/setup-intent/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customer_id }),
  });
  return response.json();
};

const createSubscription = async (
  customerId: string,
  paymentMethod: string
) => {
  const response = await fetch("/api/subscription/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_id: customerId,
      default_payment_method: paymentMethod,
    }),
  });
  return response.json();
};
