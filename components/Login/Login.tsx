"use client";
import { SubmitEvent, useState } from "react";
import "./login.css";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userMessage, setUserMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("error");

  // handling the user message error or success
  const handleUserMessage = (message: string, messageType: string) => {
    setMessageType(messageType);
    setUserMessage(message);
    setTimeout(() => {
      setUserMessage("");
    }, 3000);
  };

  // handling form submit and calling handleApiCall function
  const loginFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      handleUserMessage("All fields are required", "error");
      return;
    }
    handleUserMessage("Please wait while processing", "success");
    handleApiCall();
  };

  const handleApiCall = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        handleUserMessage(errorData.error || "login failed", "error");
        return;
      }

      const data = await response.json();
      handleUserMessage("Login successful!", "success");
      console.log("Logged in user:", data);
      setTimeout(() => {
        router.refresh();
        router.replace("/");
      }, 2000);
    } catch (error: any) {
      handleUserMessage(`Error: ${error.message}`, "error");
      console.log(error);
    }
  };
  return (
    <div className="login">
      <form onSubmit={loginFormSubmit}>
        <div className="login__form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="login__form-field_input"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="login__form-field login__last">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="login__form-field_input"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className="login__user-action">
          <p
            className={`${messageType === "error" ? "error__message" : "sucess__message"}`}
          >
            {userMessage}
          </p>
          <button type="submit">Login</button>
        </div>
      </form>
      <div className="login__content">
        <article>Real-time learning, real-world growth.</article>
        <p>Login - Start learning</p>
      </div>
    </div>
  );
};

export default Login;
