import io from "Socket.IO-client";
import { useEffect, useState } from "react";
let socket;

const Home = () => {
  const [input, setInput] = useState("");

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update-input", (msg) => {
      setInput(msg);
    });
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
