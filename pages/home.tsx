import io from "socket.io-client";
import { useEffect, useState } from "react";
import { baseURL } from "@/lib/url";
let socket;

const Home = () => {
  const [input, setInput] = useState("");

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    console.log(window.location.host);
    await fetch("/api/socket");
    socket = io(baseURL);

    console.log(socket);

    // socket.on("connect", () => {
    //   console.log("connected");
    // });

    // socket.on("update-input", (msg) => {
    //   setInput(msg);
    // });
  };

  const onChangeHandler = (e) => {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  };

  const emitMessage = async () => {
    await fetch("/api/hello");
  };

  return (
    <div>
      <button onClick={emitMessage}>Hello World</button>
      <input
        placeholder="Type something"
        value={input}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default Home;
